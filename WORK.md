# WORK.md — What changed and why

A record of the work done on this recruitment portal, grouped by area. Each
entry states the problem found, the fix, and the reasoning behind it.

- **Verified with:** `next build` (compiles clean), `next lint` (no warnings),
  and manual runs against the Firestore emulator.
- **Stack:** Next.js 14 (App Router), Firestore via `firebase-admin`,
  Better Auth, Tailwind + shadcn/ui, react-hook-form + zod.
- **Package manager:** bun.

**Contents**

| Section | Covers |
|---|---|
| [1](#1-the-response-storage-malfunction) | The response-storage malfunction |
| [2](#2-security) | Security |
| [3](#3-correctness-bugs) | Correctness bugs |
| [4](#4-performance) | Performance |
| [5](#5-department-data) | Department data |
| [6](#6-user-interface) | User interface |
| [7](#7-configuration-and-tooling) | Configuration and tooling |
| [8](#8-known-gaps) | Known gaps |

---

## 1. The response-storage malfunction

**Symptom.** Applicants filled in answers, submitted successfully, and the admin
"View Responses" panel showed *Not Answered* for most questions. No error was
raised anywhere — the submission succeeded and the record was written.

**Evidence.** Reading the stored document straight out of Firestore showed the
answers were not merely hidden in the UI; they were never written:

```
['Which web technologies or frameworks have you worked with?'] = 'React, Next.js, python, java, ML'   ✅
["Share a link to a website or project you've built."]         = ''                                    ❌
```

One question stored correctly, the other stored an empty string. The only
structural difference between them is the **trailing full stop**.

**Root cause.** `react-hook-form` treats a field `name` as a *path*, not a
literal key, and splits it on `.` and `[]`. Field names were being registered
using the raw question text, so:

```js
stringToPath("Share a link to a website or project you've built.")
//         → ["Share a link to a website or project you've built"]   ← the "." is stripped

stringToPath("Which web technologies or frameworks have you worked with?")
//         → ["Which web technologies or frameworks have you worked with?"]  ← unchanged
```

The library therefore stored the answer under the key *without* the full stop,
while the submit handler read it back with `values[question.name]` — *with* the
full stop. The lookup missed, `|| ""` kicked in, and an empty answer was posted
to the API, which faithfully persisted it.

**Blast radius.** 16 of 24 questions — every question ending in `.` or
containing `(…etc.)`. Two thirds of every application was being discarded, and
because the failure was silent it would only have surfaced during shortlisting,
after the applicant window closed.

**Fix** (`components/FormComp.jsx`). Questions are now registered under a
generated, path-safe field id instead of raw prose, and mapped back to the
human-readable text only at submit time:

```js
const fieldIdForQuestion = (name) => {
  let hash = 2166136261;                        // FNV-1a — stable across reloads
  for (let i = 0; i < name.length; i += 1) {
    hash ^= name.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
  return `q_${slug}_${(hash >>> 0).toString(36)}`;
};
// "Share a link to a website or project you've built."
//   → "q_share_a_link_to_a_website_or_project_you_1vydzsl"
```

The id is derived from the question text, so identical questions shared by two
departments still collapse to one field, and the stored `Questions` map keeps
the readable question as its key — the admin view and CSV export are unchanged.
Verified: all 24 questions produce unique, path-safe ids with no collisions.

**A second data loss found while tracing this.** The "Why do you want to join…"
question was rendered as a form field but was never included in the submit
payload — `submitDepartment` only mapped that department's own questions. It is
absent from the stored record above for exactly this reason. It is now attached
to every department's submission.

**Why it is worth being precise about where this bug lives:** the corrupted data
is server-side, but the corruption happens in the browser. The API received
`""` and stored `""` correctly. The client is what lost the answer.

---

## 2. Security

### The admin page leaked every applicant to any visitor

`app/(pages)/admin/page.jsx` read the full applicant collection in a Server
Component and passed it as props to a Client Component that only *then* checked
the role:

```jsx
const snapshot = await db.collection("formData").get();   // every applicant
return <AdminContent applicants={applicants} />;          // serialised to the browser
```

The "Access Denied" screen was cosmetic — the data had already been sent in the
RSC payload. The guard now runs *above* the Firestore read, so a non-admin never
causes the query to execute.

Verify: `curl -s localhost:3000/admin | grep -c RegistrationNumber` → `0`.

### Three unauthenticated API routes

| Route | Exposure |
|---|---|
| `/api/admin/applicants` | Full PII for every applicant to an unauthenticated `curl` |
| `/api/shortlist/[id]` | Anyone knowing a document id could alter recruitment results |
| `/api/send-email` | Arbitrary recipients + arbitrary HTML sent **from the org's Gmail account** |

All three now call a shared `requireAdmin()` guard (`lib/auth-guards.js`), which
returns the 401/403 for the handler to pass straight back.

### Mass assignment in the submission endpoint

`app/api/submit-form/route.js` destructured two fields out of the request body
and wrote **everything else the client sent** into the document:

```js
const { Department, Questions, ...formFields } = data;
transaction.set(newDocRef, { ...formFields, Department, Questions, Email: userEmail, ... });
```

`Email` and `createdAt` were safe because they were assigned after the spread.
`shortlisted` was not — **any signed-in applicant could POST
`{"shortlisted": true}` and shortlist themselves.**

Replaced with an explicit allowlist (`Name`, `RegistrationNumber`, `Gender`,
`Phone`, `Year of Study`), each type-checked and length-capped, with
`shortlisted: false` now assigned server-side on create.

### Firestore was open to the internet

`firestore.rules` allowed `read, write: if true` on every document — applicant
PII plus the Better Auth session and user collections were world-readable and
world-writable. All access in this app goes through the Admin SDK, which
bypasses rules, so denying all client access costs nothing and closes the hole.

> Editing the file changes nothing until deployed: `bun run rules:deploy`.

### Forgeable sessions

Better Auth was running on its **default secret**, which makes session cookies
forgeable. `lib/auth.js` now throws at startup if `BETTER_AUTH_SECRET` is
missing, throws if `BETTER_AUTH_URL` is unset in production (otherwise OAuth
callbacks silently point at localhost), and enforces an 8-character minimum
password.

Failing loudly at boot is deliberate: a silent fallback to a known key is worse
than an app that refuses to start.

---

## 3. Correctness bugs

**The portal was closed.** The submission deadline was hardcoded to
`2026-08-23`, a date already in the past, so *every* submission returned 403.
Now read from `APPLICATION_DEADLINE`; unset means open, unparseable logs a
warning rather than closing the portal.

**Application-cap race.** The "max 2" check was a read followed by a separate
write, so two concurrent submissions both saw one existing application and both
succeeded. Both now run inside `db.runTransaction()`. The cap itself comes from
a single `MAX_APPLICATIONS` constant — it had been hardcoded as a bare `2` in
five separate places.

**Gender was collected and thrown away.** The `<select>` rendered, but `Gender`
appeared in neither the zod schema nor the submitted payload. `Year of Study`
had the opposite problem — in the schema and payload, but with no input rendered
anywhere, so it was always `undefined`. Both now work end to end, and both were
added to the CSV export.

**Unreachable 404 in the shortlist route.** `update()` was called before the
existence check, and Firestore's `update()` throws on a missing document — so
the 404 branch could never run and callers got a raw Firestore error string
instead. Reordered to get → check → update.

**The email route had four separate faults:** a guaranteed crash from
`reviews.find(...)` returning `undefined` mid-send-loop (leaving some recipients
already emailed with no record of which), sequential `await` in a loop that blew
the serverless timeout at scale, unsanitised HTML from the composer, and a
transport built at module scope so a missing env var threw on import. Now:
department read off the applicant record, `Promise.allSettled` in chunks of 5
capped at 100 recipients, `sanitize-html` with a tag allowlist matching the
TipTap editor, and a lazily-built transport returning 503.

**Route validation.** `/join` threw on a bare visit (`params.joinIds` read
without optional chaining), accepted duplicate ids, and had a
`startsWith("clerk_")` escape hatch left over from a removed auth provider that
let any id beginning `clerk_` bypass validation. `/development`'s two links were
bare UUIDs missing the `/join` prefix — and those UUIDs did not exist in the
constants at all.

**No error boundary.** `app/_error.js` used the Pages Router convention and was
never invoked by the App Router. Replaced with `error.jsx`, `global-error.jsx`
and `not-found.jsx`.

**Stale closures in MailComposer.** `onUpdate` called
`setPayloadData((prev) => ({ ...payloadData, … }))` — it received `prev` and
then ignored it, spreading the captured value instead, so concurrent edits to
subject and body clobbered each other. Same pattern in two other places.

---

## 4. Performance

### Nine fake compute loops

Each ran a heavy loop **on every render** and discarded the result — several
wrote into a `data-*` attribute purely so the optimiser could not eliminate them.

| File | Function | Cost per render |
|---|---|---|
| `app/page.jsx` | `evaluateViewportMetrics` | 300,000 `Math.sqrt` + `Math.sin` |
| `components/FormComp.jsx` | `validateFormEntropy` | 200,000 regex tests |
| `app/(pages)/departments/page.jsx` | `verifyDepartmentMatrix` | ~1.2M ops |
| `components/Hero.jsx` | `calculateEasingCurves` | ~1M ops |
| `components/AdminContent.jsx` | `evaluatePermissionSignature` | 80,000 |
| `components/Footer.jsx` | `computeFooterLayoutChecksum` | 40,000, on every page |
| `components/DataTable.jsx` | `evaluateDataIntegrity` | `rows × 500` |
| `components/Card.jsx` | `calculateSurfaceShading` | 50,000 |
| `components/AllDepartments.jsx` | `computeMeshDensity` | 35,000 |

The landing page was the worst: a 300,000-iteration loop combined with a
`mousemove` listener triggering three chained state updates — roughly 900,000
float operations per mouse move, ~54 million per second at 60 events/sec. That
is why the page pinned a CPU core.

### Other render-path work

- **Leaking listeners.** `mousemove` and `scroll` were registered with no
  cleanup and accumulated across remounts. The state they fed was never
  rendered, so both were removed outright rather than merely cleaned up.
- **`Math.random()` in React keys** (4 sites in `DataTable`, 1 in departments).
  A new key every render means every row, cell and header is destroyed and
  rebuilt — the exact opposite of what keys are for, and it breaks scroll
  position, focus and text selection. react-table already supplies a stable key
  in its prop getters; it is now destructured out rather than spread.
- **A 200 ms `setInterval`** in the NavBar re-rendered it five times a second,
  forever, on every page — to update a 10px grey clock.
- **Components declared inside other components** (5 sites) make React treat
  them as a new type on every render and remount the whole subtree, discarding
  state and focus. Hoisted to module scope.
- **~25 chained `useEffect`s** computing values that belong in render
  (state → effect → state → effect). Replaced with plain derivation.
  `app/page.jsx` went from 139 lines / 9 state vars / 7 effects to 44 / 1 / 0.
  `Hero` and `Footer` no longer need `"use client"` and render on the server.
- **Per-render deep clones.** `JSON.parse(JSON.stringify(session))` in three
  files produced a new object identity every render, defeating memoisation
  downstream.
- **The DataTable filter pipeline** held two filtered *copies* of the row array
  in state, reconciled by reference identity through a four-effect cascade using
  an O(n²) helper built from nested `.map()` calls used as `forEach`. Replaced
  with two plain filter values and one `useMemo`.
- **"Reset Filters" called `window.location.reload()`** — discarding the whole
  page to clear two filters. Now resets state in place. The filter components
  were also comparing against cmdk's `currentValue`, which cmdk lowercases, so
  the department filter never matched anything.
- **Context value memoised** in `SubmissionsProvider`, which had been passing an
  inline object literal.

### Dependency and module weight

- **Removed a 359 MB icon package.** `@material-symbols-svg/react` — 11,742
  files — was barrel-imported by `constants/index.js` to populate a
  `reviews[].icon` field that nothing rendered. Because nearly every route
  imports the constants, it sat on the compile path of the entire app.
  `/departments` dropped from **8,784 modules to 968**, and its compile time
  from **12.3s to 0.43s**.
- **Deleted 24 unreachable files**, verified with an import-graph walk rather
  than grep. Among them `lib/actions/form.action.js`, whose `submitFormAction`
  wrote directly to Firestore with no auth, no deadline and no duplicate check —
  unreferenced, but one import away from being a live hole.
- **Removed `gsap`, `ogl`, `framer-motion`, `dotenv`** and other unused
  dependencies.
- **Turbopack** for dev (`bun run dev`), with `dev:webpack` as a fallback.
  Measured cold compile: `/` 66s → **7s**, `/departments` 12.3s → **0.43s**.

---

## 5. Department data

The shipped data was anonymised placeholder text — department names like
`§_Mn9X7_qz`, questionnaire text like `poAx ZQPF iL0C *$ Peq#…`, and the literal
string `"Organization Name"` throughout.

The real names were **recovered, not invented**. Each department carried an
`icon:` from the icon package, and `public/assets/images/icons/` holds a
matching set of SVG filenames:

| id (unchanged) | icon | restored name |
|---|---|---|
| `c21ca066…` | `ManageAccounts` | Management |
| `4499a966…` | `Campaign` | Marketing |
| `3936d5a2…` | `ConnectWithoutContact` | Outreach |
| `e2ed9c2c…` | `DesignServices` | UI/UX Design |
| `d3beefc1…` | `Palette` | Graphic Design |
| `8143de1d…` | `Language` | Web Development |
| `339f0f8a…` | `Mobile2` | App Development |
| `9055864f…` | `SportsEsports` | Game Development |
| `c0f3b1d1…` | `Analytics` | Data Science |
| `a1d920df…` | `Cloud` | Blockchain & Web3 |
| `6a89c4e2…` | `Hub` | Open Source |
| `3e9ac635…` | `Trophy` | Competitive Programming |

Cross-check: the original `/development` page listed exactly the `Mobile2` and
`Language` departments as its two "Development Departments" — matching App
Development and Web Development.

**The ids are unchanged**, so existing records and any `/join/<id>` links people
already hold still resolve.

Also added `ORG_NAME` / `MAX_APPLICATIONS` constants, a `tagline`, `iconKey` and
real `description` per department, two relevant questions per department, and
`DEVELOPMENT_DEPARTMENT_NAMES`. Dropped six unused exports, and fixed
`CSV_Header` (removed `Pref`, which was never submitted and always blank; added
`Gender` and `Year of Study`).

Everything user-facing is editable in this one file.

---

## 6. User interface

The refactor above fixed behaviour but left the app visually bare — unstyled
checkboxes in a plain list, the "Recruitment Notice" rendering as stray text
above the hero rather than a dialog, and no visual hierarchy anywhere.

### The design system

`app/globals.css` was **nine lines** and defined **none** of the CSS variables
`tailwind.config.js` referenced, which is why every shadcn component rendered
unstyled — `bg-background` resolved to nothing.

It now implements a "GDG Campus Dark Elevation" system built from the supplied
design brief: tonal surface tiers (`#0F1015` → `#1A1D24` → `#21252E` →
`#2A2F3B`) rather than drop shadows, which is how Material 3 handles depth on
dark themes; `#2D333F` ghost strokes; and the Google quad palette used
*functionally* — blue for primary actions and focus rings, green for success and
shortlisted states, yellow for pending, red for destructive and validation.

These are expressed through the **existing shadcn variable contract**
(`--background`, `--card`, `--primary`, …) so every Radix primitive already in
the project adopted the new look without being rewritten. Alongside them sit
reusable classes — `.container-page`, `.surface`, `.btn-*`, `.field`, `.badge`,
`.g-rule` (the four-colour signature bar), `.g-crown`, `.icon-tile` — so the JSX
stays readable.

Typography is Plus Jakarta Sans for display and Inter for body, loaded once in
the root layout as CSS variables. The layout previously imported `Inter` and
`ThemeProvider` and used **neither**, while four other files separately
re-declared fonts that were then applied to nothing.

### Screens

- **NavBar** — sticky, backdrop-blurred, quad-colour rule, pill navigation with
  an active-route indicator, working mobile menu, and a skeleton while the
  session resolves.
- **Landing** — gradient display headline, status pill, bouncing four-dot
  indicator, stat strip driven off real data, plus value-proposition and
  three-step process sections.
- **Departments picker** — from a plain `<ul>` of native checkboxes to a
  responsive card grid: per-card icon tinted in the department colour, tagline,
  selection ring, lock and "Already submitted" state, dimming for cards you can
  no longer select, a floating glass action bar, and a loading skeleton.
- **Application form** — two-column layout, a stepper, per-department sections
  each with their own colour rule, real `Select` controls for Gender and Year,
  auto-uppercasing registration number, submitting spinner, styled error panel,
  and a sticky sidebar showing progress.
- **Sign-in** — centred card with the quad-colour crown and a **Google sign-in
  button**. `socialProviders.google` was configured in `lib/auth.js` but had no
  entry point in the UI, so the entire OAuth path was unreachable. The page also
  imported `Button`, `Card`, `Input` and `Label` from shadcn and used none of
  them — the form was raw `<input>`s with inline styles.
- **PopupComp** — was an inline bordered `<div>` in the page flow, never a
  dialog. Rebuilt as a real modal: blurred scrim, `role="dialog"` +
  `aria-modal`, Escape to close, click-outside to close, body scroll lock.
- **GDGLoader** — rendered `<p>Loading...</p>` and was named `DWASFWLoader`.
  Now four bouncing Google-coloured dots.
- **UserButton** — imported `DropdownMenu`, `Avatar`, `Button` and two icon
  sets, declared state and a helper, then used **none** of it, rendering a plain
  `<span>`. Rewritten to actually use an avatar.

### Admin table

Uppercase headers, row hover, pill-style shortlist toggle, empty state, and
record/shortlisted/selected counts. Beyond styling:

- **Rows are now clickable** to select, rather than requiring a hit on a small
  checkbox. Clicks on the checkbox, shortlist pill and action buttons
  `stopPropagation` so they do not double-toggle.
- **Per-row actions.** A new Actions column with View Responses and Custom Mail
  buttons that narrow the selection to that person and open the dialog for them.
  Both dialogs became optionally controlled to support this, rather than being
  duplicated per row.
- **MailComposer was never rendered.** It was imported by `DataTable` and
  `handleRowSelection` was defined, but the component was never placed in the
  tree — the entire custom-mail feature was unreachable from the UI.
- **Columns fixed.** Dropped `Preference`, which mapped to a field that was
  never submitted and so was always blank; added `Year` and `Gender`, which now
  carry real data.
- The selection column had a sort affordance and responded to header clicks
  despite not being sortable; both suppressed.

### Interactive landing background

A `three.js` particle field sits behind the hero — ~1,400 points tinted only in
the Google palette (weighted toward blue so it reads as one system rather than a
rainbow), with the camera easing toward the pointer for parallax.

Scoped deliberately: **landing page only.** The picker, form and admin views
stay completely static so nothing competes with the task at hand. It is loaded
via `next/dynamic` with `ssr: false`, and the build confirms the isolation —
three.js compiles to its own chunks and appears in **none** of the shared
bundles, so someone going straight to the application form never downloads it.

It honours `prefers-reduced-motion` (one static frame, no animation loop, no
pointer listener), pauses when the tab is hidden or the hero scrolls out of
view, disposes geometry/material/renderer on unmount, and falls back to the CSS
glow if WebGL is unavailable.

---

## 7. Configuration and tooling

- **`next.config.mjs`** — `images.domains` → `remotePatterns` (the former is
  deprecated), `poweredByHeader: false`, and `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `Strict-Transport-Security`. A CSP is deliberately **not** set: it needs
  tuning against the app's inline styles first, and a broken CSP fails silently.
- **ESLint** — `next lint` had been *prompting interactively*, meaning linting
  had never run on this project. Added `.eslintrc.json`. Fixing this surfaced a
  broken dependency: a stray `typescript@7.0.2` was incompatible with
  `@typescript-eslint/parser`, crashing the linter before it read a single file.
- **`scripts/set-admin.mjs`** — admin access requires `role === "admin"` and
  there is deliberately no UI to grant it, so without this script nobody can
  reach the admin panel at all. Supports `--revoke`.
- **`.env.example`** — documents `BETTER_AUTH_SECRET` as required with its
  generation command, adds `APPLICATION_DEADLINE`, and **removes six
  `NEXT_PUBLIC_FIREBASE_*` variables** that no code reads: there is no
  client-side Firebase SDK here, all access is server-side through
  `firebase-admin`, so documenting them was misleading.
- **`jsconfig.json`** — dropped the unused `@components/*` and `@lib/*` aliases.

### Cost considerations

- `/api/check-applications` uses a Firestore **projection** (`.select("Department")`)
  so the common "which departments have I applied to?" call transfers one field
  rather than whole documents.
- Better Auth runs with a **cookie cache** (1 day) and a 7-day session, which
  removes a session-collection read from most requests.
- Client-side caching of submitted departments in `sessionStorage` avoids
  refetching on every navigation — and is cleared on sign-out so a second user
  on a shared browser cannot see the previous user's data.

---

## 8. Known gaps

Stated openly rather than left to be discovered.

- **`/admin` fetches the entire `formData` collection on every request**, with
  no pagination or limit. Fine at current volume, but it is the first thing that
  will hurt on cost and latency at scale — server-side pagination is the natural
  next piece of work.
- **No tests.** There is no test framework or CI. Verification for everything
  above is `next build`, `next lint`, and manual runs against the emulator.
  Adding a test suite — starting with the submission path — is the highest-value
  next step.
- **No Content-Security-Policy**, for the reason given above.
- **`GENERAL_QUESTION`** is exported from the constants but not yet wired into
  the form; the shared portfolio/availability pair is defined and unused.
- **`components/common/CountdownTimer.jsx`** is unreferenced but kept, since it
  pairs naturally with `APPLICATION_DEADLINE`. Its default `targetDate` is still
  a hardcoded past date.
- **`components/ui/*`** retains some unreferenced files. A component library is
  normal to keep whole.
- **Existing records are not retroactively repaired.** Applications submitted
  before the fix in §1 still hold empty answers; the fix applies to new
  submissions.
