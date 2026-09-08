# RUNNING.md — Setup, testing and verification

How to run this project locally, verify the fixes described in
**[WORK.md](WORK.md)**, and move to production.

Local setup needs **no Firebase account** — it runs against the Firestore
emulator.

---

## 1. Prerequisites

- Node 18+ and [bun](https://bun.sh) (swap `bun` for `npm` throughout if you
  prefer)
- Java 11+ — required by the Firestore emulator
- `firebase-tools` is already a dev dependency; no global install needed

```bash
bun install
```

---

## 2. Environment

Create `.env.local` (it is gitignored — never commit it):

```bash
BETTER_AUTH_SECRET="<paste the output of: openssl rand -base64 32>"
BETTER_AUTH_URL="http://localhost:3000"

FIREBASE_PROJECT_ID="demo-recruitment"
FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
```

`BETTER_AUTH_SECRET` is **required** — the app throws at startup without it,
deliberately, because the alternative is Better Auth silently falling back to a
publicly known key that makes session cookies forgeable.

Optional:

| Variable | Effect when unset |
|---|---|
| `APPLICATION_DEADLINE` | No deadline; submissions stay open |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign-in button fails; email/password still works |
| `EMAIL_USERNAME` / `EMAIL_PASSWORD` | Admin "send mail" returns 503 |

See `.env.example` for the full annotated list.

---

## 3. Run it

Two terminals:

```bash
bun run emulator      # terminal 1 — Firestore emulator on :8080, UI on :4000
bun run dev           # terminal 2 — Next.js on :3000
```

> Env files are read **at server start**. If you create or edit `.env.local`
> while the dev server is running, restart it.

---

## 4. Become an admin

Admin access requires `role === "admin"` on the user record, and there is no UI
to grant it by design. Sign up in the app first, then:

```bash
bun run set-admin you@example.com            # grant
bun run set-admin you@example.com --revoke   # revoke
```

**Sign out and back in afterwards** — the role travels in the session cookie, so
an existing session will not see the change.

---

## 5. Manual walkthrough

1. **Sign up** at `/auth/signin` (password must be 8+ characters).
2. **Pick departments** at `/departments` — you may select up to two; the
   counter is driven by remaining slots, not a hardcoded 2.
3. **Apply** — fill in every field including Gender and Year of Study.
4. **Check the answers were stored.** This is the regression test for the
   response-storage bug in WORK.md §1:

   ```bash
   curl -s -H "Authorization: Bearer owner" \
     "http://127.0.0.1:8080/v1/projects/demo-recruitment/databases/(default)/documents/formData" \
     | python3 -m json.tool | grep -A2 stringValue | head -40
   ```

   Every question you answered must hold your text. **Any empty string for a
   question you answered is the bug returning** — pay particular attention to
   questions ending in a full stop, which is what triggered it.
5. **Review as admin** at `/admin` — click a row to select it, or use the
   per-row View Responses / Custom Mail buttons.

---

## 6. Security verification

With the dev server running:

| Command | Expected |
|---|---|
| `curl -s localhost:3000/admin \| grep -c RegistrationNumber` | `0` — no applicant data in the payload for a signed-out visitor |
| `curl -o /dev/null -w "%{http_code}" localhost:3000/api/admin/applicants` | `401` |
| Same, signed in as a non-admin | `403` |
| Reading another user's applications via `/api/check-applications?email=…` | `403` |
| `PATCH /api/shortlist/<nonexistent-id>` as admin | `404` |

**Mass assignment** (WORK.md §2) — submit an application with an injected field
and confirm it is ignored:

```bash
# as a signed-in applicant, with a valid session cookie
curl -X POST localhost:3000/api/submit-form \
  -H "Content-Type: application/json" \
  -b "better-auth.session_token=<your cookie>" \
  -d '{"Department":"Web Development","Name":"Test","shortlisted":true,"Questions":{}}'
```

The stored document must show `shortlisted: false`. Before the fix it honoured
the injected `true`, letting applicants shortlist themselves.

**Concurrency** — five simultaneous submissions from one user must land exactly
two records, enforced by the Firestore transaction.

---

## 7. Build checks

```bash
bun run build     # must compile clean
bun run lint      # must report no warnings or errors
bun run clean     # drop the .next cache
```

---

## 8. Resetting to a clean state

The emulator runs **in memory** — no `--export-on-exit` is configured — so
stopping it discards all users and applications. Nothing is written to disk and
nothing is committed to the repository.

Browser state does **not** clear itself, and will leave you appearing signed in
as a user that no longer exists:

- `better-auth.session_token` cookie
- `localStorage` → `recruitment-draft:*` (form drafts)
- `sessionStorage` → `submitted_depts_*`

DevTools → Application → Storage → **Clear site data** on `localhost:3000`, or:

```js
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c =>
  document.cookie = c.split("=")[0].trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
);
location.reload();
```

---

## 9. Moving to production

1. Remove `FIRESTORE_EMULATOR_HOST` and set real credentials:
   `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   (or `GOOGLE_APPLICATION_CREDENTIALS`).
2. Set `BETTER_AUTH_URL` to the deployed origin — the app throws in production
   without it, because OAuth callbacks would otherwise point at localhost.
3. **Deploy the Firestore rules.** Editing `firestore.rules` changes nothing
   until deployed, and the original rules allowed public read/write:

   ```bash
   bun run rules:deploy
   ```
4. Generate a fresh `BETTER_AUTH_SECRET` for production; do not reuse the local
   one.
5. Grant your first admin with `set-admin` against the production project.

---

## 10. Troubleshooting

| Symptom | Cause |
|---|---|
| `BETTER_AUTH_SECRET is not set` | No `.env.local`, or the dev server was not restarted after creating it |
| Every auth call returns 500 | Same as above — `lib/auth.js` throws at module load, so the failure surfaces on every route that touches auth |
| `Failed to create account` | Usually the above. The real error is now logged to the browser console |
| `PERMISSION_DENIED` reading the emulator REST API | Expected — rules deny client access. Add `-H "Authorization: Bearer owner"` to bypass as the emulator owner |
| Google sign-in fails | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` unset |
| Fonts warn `EAI_AGAIN fonts.googleapis.com` | Transient DNS failure fetching Google Fonts at compile time; Next retries and falls back to system fonts |
| `/admin` returns Access Denied | Role not granted, or you have not signed out and back in since running `set-admin` |
| Slow first page load in dev | Next compiles each route on first visit; production builds are precompiled |
