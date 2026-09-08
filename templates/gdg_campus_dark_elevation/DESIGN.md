---
name: GDG Campus Dark Elevation
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#c2c6d5'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#8c909f'
  outline-variant: '#424753'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e69'
  primary-container: '#4d8efe'
  on-primary-container: '#00285c'
  inverse-primary: '#005ac1'
  secondary: '#6ddd81'
  on-secondary: '#003914'
  secondary-container: '#30a550'
  on-secondary-container: '#003210'
  tertiary: '#fbbc06'
  on-tertiary: '#402d00'
  tertiary-container: '#b88900'
  on-tertiary-container: '#372700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004494'
  secondary-fixed: '#89fa9b'
  secondary-fixed-dim: '#6ddd81'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdea0'
  tertiary-fixed-dim: '#fbbc06'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 1.5rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
---

## Brand & Style

This design system targets an ambitious student engineering community applying for core technical, design, management, and outreach tracks. The emotional register is technical, authoritative, yet welcoming and inspiring. It translates Google's quintessential Material You (M3) vernacular into a sleek, high-contrast dark environment crafted specifically for high-stakes campus recruitment workflows.

The system mixes modern **Corporate / Modern (Material Design 3)** with **Developer-Centric Minimalism**:
- **Tonal Depth**: Layered charcoal elevations replace standard drop shadows, producing an authentic Material dark theme.
- **Intentional Brand Accents**: The iconic Google quad-color palette is deployed with functional discipline—avoiding decorative clutter while delivering instant recognizability.
- **Precision Engineering**: Sharp typographic hierarchy, precise 1px boundary lines, and fluid interactive micro-states communicate production-grade developer rigor.
- **Signature Identity**: The 4-color segmented progress bar serves as an architectural anchor across card crowns, persistent top navigation, and stage indicators.

## Colors

The palette uses dark charcoal surfaces layered by lightness to establish spatial order without relying on harsh fills. Functional accents strictly follow Google's standard quad-color identity to convey explicit states.

### Surface Tiers & Neutral Scales
- **Background (Base)**: `#0F1015` — Deepest canvas tone, reducing eye strain during late-night hackathons and recruitment drives.
- **Surface**: `#1A1D24` — Base component level for cards, side navigation, and modals.
- **Surface Container**: `#21252E` — Elevated containers, input fields, interactive chip defaults, and hovered rows.
- **Surface Container High**: `#2A2F3B` — Floating menus, dropdown lists, tooltips, and active selection states.
- **Subtle Border (Ghost Stroke)**: `#2D333F` — Structural dividers, outlines, and inactive control boundaries.
- **Text Primary**: `#F1F3F4` — High-contrast off-white providing WCAG AAA compliance on all charcoal tiers.
- **Text Secondary / Muted**: `#9AA0A6` — Explanatory copy, metadata, timestamps, and placeholder labels.

### Google 4-Brand Accent Semantics
- **Google Blue (`#4285F4`)**: Primary interactive color. Used for primary CTAs, active radio/checkbox states, focus indicator rings, link text, and initial review stages.
- **Google Green (`#34A853`)**: Success and status affirmation. Reserved for "Shortlisted", "Selected", verified submission badges, and completed task indicators.
- **Google Yellow (`#FBBC05`)**: Cautionary highlights and progress markers. Applied to "Under Review", "Interview Scheduled", pending assessments, and priority tags.
- **Google Red (`#EA4335`)**: Critical status and system urgency. Dictates application deadlines, expired submission links, "Rejected" statuses, and input validation errors.

### Signature Quad-Color Strip
Constructed as a 4-stop linear division with hard boundaries:
`linear-gradient(90deg, #4285F4 0% 25%, #EA4335 25% 50%, #FBBC05 50% 75%, #34A853 75% 100%)`.
Used exclusively at 2px to 4px thickness for global nav borders, selected card headers, and phase dividers.

## Typography

Typography pairs **Plus Jakarta Sans** (a geometric display face capturing Google Sans’ friendly clarity) for headlines, and **Inter** for dense, readable UI controls, tabular data, and candidate application reviews.

- **Display & Headlines**: Generous x-height, clear geometry, and tightened tracking (-0.02em) on sizes above 24px produce punchy titles without sacrificing mobile layout boundaries.
- **Body & Form Inputs**: High legibility on dark backgrounds with normalized tracking (+0.01em) to combat dark-mode halation.
- **Status & Technical Labels**: Medium and Semi-bold weights in Inter (`label-sm`, `label-md`) guarantee immediate readability when paired with status dot indicators and compact badges.

## Layout & Spacing

The portal uses an 8pt layout rhythm built on a 12-column responsive fluid grid designed to accommodate candidate lists, submission pipelines, and multi-stage evaluation panels.

### Responsive Breakpoints
- **Desktop (1200px and up)**: 12-column fluid grid. Max container width: `1280px`. Gutters: `24px` (`1.5rem`). Margins: `48px` (`3rem`). Sidebar navigation is docked at `260px` width; main work area adapts smoothly.
- **Tablet (768px - 1199px)**: 8-column layout. Gutters: `24px` (`1.5rem`). Margins: `32px` (`2rem`). Dashboard columns collapse to dual panels; detail drawers slide over the primary canvas.
- **Mobile (320px - 767px)**: 4-column layout. Gutters: `16px` (`1rem`). Margins: `16px` (`1rem`). Form actions shift to full-width pinned bottom bars; recruitment pipeline steps convert to horizontal swipeable rails.

### Spacing Principles
- Internal card padding scales from `16px` (compact summary cards) to `24px` (application forms and detail views).
- Horizontal form groupings enforce an `8px` gap between interdependent inputs (e.g., country code and phone number).

## Elevation & Depth

To remain true to authentic Material 3 dark-theme design, visual depth is achieved through **tonal layering** and **subtle boundary definition**, rather than high-contrast dropshadows which muddy dark UI surfaces.

- **Level 0 (Canvas Base - `#0F1015`)**: Page background, root viewport wrapper.
- **Level 1 (Default Surface - `#1A1D24`)**: Resting cards, top navigation bar, drawer shells. Outlined by default with a crisp 1px stroke of `#2D333F`.
- **Level 2 (Elevated Container - `#21252E`)**: Active cards, dropdown containers, code snippets, hovered states. Shadows are ambient and diffused: `0 4px 20px -2px rgba(0, 0, 0, 0.45)`.
- **Level 3 (Overlays & Dialogs - `#2A2F3B`)**: Modals, candidate detail overlay sheets, sticky application banners. Enhanced with: `0 12px 32px -4px rgba(0, 0, 0, 0.65)`, complemented by a 1px top highlight border of `rgba(255, 255, 255, 0.08)`.
- **Focus Elevation**: Interactive items under keyboard or pointer focus gain a distinct `0 0 0 2px #4285F4` ring with a `4px` outer glow at 20% opacity (`rgba(66, 133, 244, 0.2)`).

## Shapes

The interface embraces Material 3's expressive roundedness, utilizing geometric curves to soften the technical dark aesthetics.

- **Base Radius (8px / `0.5rem`)**: Text input fields, dropdown trigger buttons, code blocks, candidate evaluation scorecards.
- **Container Radius (16px / `1rem`)**: Application preview cards, modal sheets, track selection panels, file upload dropzones.
- **Pill Radius (9999px / Full)**: All primary, secondary, and tertiary action buttons, Google SSO authentication trigger, filter chips, and state notification badges.
- **Nested Shapes**: Elements inside 16px containers (such as internal metric tags or nested buttons) preserve a proportional 8px corner curve to maintain geometric harmony.

## Components

### Buttons
- **Primary CTA**: Full pill shape (`9999px`), background `#4285F4`, label `#FFFFFF` in `label-lg` weight. Hover: `#3367D6`. Active: `#2A56C6`. Includes an optional Google arrow icon aligned right.
- **Secondary (Outlined)**: Pill shape, transparent fill, 1px border of `#2D333F`, label `#F1F3F4`. Hover: Background `#21252E`, border `#4285F4`.
- **Tonal / Ghost**: Pill shape, background `#21252E`, label `#F1F3F4`. Hover: Background `#2A2F3B`.
- **Google SSO Button**: Pill shape, background `#FFFFFF`, text `#1F1F1F`, border `none`, padding `10px 24px`. Features the official SVG multicolor Google "G" logo left-aligned, separated by `12px` from the `Sign in with Google` label.

### Cards & Quad-Color Accent Crown
- **Recruitment Track & Application Cards**: Surface `#1A1D24`, 1px border `#2D333F`, 16px border-radius.
- **Signature Crown Element**: Featured or high-priority recruitment track cards incorporate a 3px top border using the 4-color segmented linear gradient: `25% #4285F4`, `25% #EA4335`, `25% #FBBC05`, `25% #34A853`. The gradient sits flush against the upper perimeter matching the card's 16px corner curvature.

### Form Inputs & Focus Rings
- **Text Inputs & Textareas**: Surface container background `#1A1D24`, 1px border `#2D333F`, 8px border-radius, font size 14px (`body-md`), text `#F1F3F4`.
- **Placeholder**: Color `#9AA0A6`.
- **Focus State**: Border transitions to `#4285F4` accompanied by a dual-ring highlight: `box-shadow: 0 0 0 2px #0F1015, 0 0 0 4px #4285F4`.
- **Error State**: Border `#EA4335`, accompanying helper text in `#EA4335` with a leading warning icon.

### Status Badges & Filter Chips
- **Pill Badges**: 9999px border-radius, padding `4px 12px`, text style `label-sm`.
  - *Shortlisted / Accepted*: Background `rgba(52, 168, 83, 0.12)`, text `#34A853`, 1px border `rgba(52, 168, 83, 0.3)`.
  - *Reviewing / Interview*: Background `rgba(251, 188, 5, 0.12)`, text `#FBBC05`, 1px border `rgba(251, 188, 5, 0.3)`.
  - *Action Required / Deadline Expired*: Background `rgba(234, 67, 53, 0.12)`, text `#EA4335`, 1px border `rgba(234, 67, 53, 0.3)`.
  - *Submitted / In Progress*: Background `rgba(66, 133, 244, 0.12)`, text `#4285F4`, 1px border `rgba(66, 133, 244, 0.3)`.
- **Filter Chips**: Inactive: `#1A1D24` fill with `#2D333F` border. Active: `#4285F4` tinted fill (`rgba(66, 133, 244, 0.15)`), border `#4285F4`, text `#FFFFFF`.

### Checkboxes & Radios
- **Checkbox**: 18x18px box, 4px border-radius. Inactive: `#21252E` surface with 1.5px `#9AA0A6` border. Checked: `#4285F4` fill with an off-white `#FFFFFF` checkmark vector.
- **Radio**: 18x18px circular frame. Selected state creates a `#4285F4` center dot (8px diameter) framed by an outer `#4285F4` perimeter.

### Custom Component: Bouncy 4-Dot Google Loader
Used for portal loading screens, portfolio fetch states, and asynchronous test evaluations.
- Composed of 4 horizontal circular nodes (each 10px diameter), spaced 8px apart.
- Node sequence: Dot 1 (`#4285F4`), Dot 2 (`#EA4335`), Dot 3 (`#FBBC05`), Dot 4 (`#34A853`).
- Animation: Vertical displacement (`translateY(-10px)`) orchestrated sequentially with a `0.15s` delay between each dot using a Material decelerate cubic bezier (`cubic-bezier(0.0, 0.0, 0.2, 1)`).