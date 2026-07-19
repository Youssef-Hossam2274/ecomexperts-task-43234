# Bundle Builder

A **Wyze security-system bundle builder** — a two-column shopping experience built as a
React prototype. On the left, a 4-step accordion walks the shopper through assembling a
system (cameras → plan → sensors → extra protection); on the right, a live "Your security
system" review panel reflects every selection, recalculates the total, and offers checkout.

Built with **Next.js 16 (App Router) + React 19** and **Tailwind CSS v4**. Everything is
**data-driven from a JSON catalog** served by a small simulated backend (the optional bonus).

> Task spec: see [`REQUIREMENTS.md`](./REQUIREMENTS.md). Design capture: [`src/features/bundle-builder/DESIGN.md`](./src/features/bundle-builder/DESIGN.md).

---

## Run it

**Requirements:** Node **20+** (developed on Node 24) and npm.

From a clean clone:

```bash
npm install      # install dependencies
npm run dev      # start the dev server
```

Open **[http://localhost:3000](http://localhost:3000)**.

### Production build

```bash
npm run build    # compile a production build
npm start        # serve it on http://localhost:3000
```

The committed repo builds from a clean clone with no extra steps — the generated icon
components and the product imagery are all checked in.

### Other scripts

| Script              | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `npm run lint`      | ESLint                                                           |
| `npm run typecheck` | `tsc --noEmit`                                                   |
| `npm run format`    | Prettier write (`format:check` to verify only)                   |
| `npm run icons`     | Regenerate typed icon components from SVGs (see [Icons](#icons)) |

A Husky **pre-commit** hook runs format → lint → typecheck → build so nothing broken lands.

---

## What's implemented

Everything in the requirements, plus the backend bonus:

- **4-step accordion** — Step 1 open on load; steps expand/collapse; each header shows
  "STEP X OF 4", icon, title, and a right-side state indicator ("_N_ selected" + chevron).
  Each open step ends with a **Next: …** button that advances.
- **Product cards** — image, title, description, "Learn More", optional discount **badge**,
  **variant/color selector**, **quantity stepper**, and struck-through compare-at + active
  price. Cards with qty > 0 render in the **selected** (highlighted-border) state. Only the
  elements a given product actually has are rendered — all driven from data.
- **Variant selector with per-variant quantities** — Red and Blue of the same product are
  tracked separately. The card's stepper is bound to the **active** variant (select Blue and
  it shows Blue's count, leaving your Red count untouched). The review panel shows **every
  variant with count > 0 as its own line**.
- **Steppers kept in sync** — the card stepper and the review-panel line stepper edit the
  same underlying count; changing one updates the other and the total live.
- **Live review panel** — grouped line items (Cameras / Sensors / Accessories / Plan), a
  shipping row, satisfaction badge, financing line, **total** (with pre-discount strike-through),
  savings callout, **Checkout** button, and **Save my system for later**.
- **Persistence** — "Save my system for later" writes the configuration to `localStorage`.
  Configure → save → reload/return → it's restored exactly.
- **Responsive** — matches the Figma on desktop and stays usable down to a phone.
- **Backend bonus** — the catalog is served from a simulated backend behind `GET /api/catalog`
  and product imagery behind `GET /api/assets/[...path]` (details below).

---

## How it's structured

```
src/
  app/
    page.tsx                      # server component: loads catalog, renders the builder
    layout.tsx                    # app-wide font + globals
    api/catalog/route.ts          # GET /api/catalog  (serves the JSON catalog)
    api/assets/[...path]/route.ts # GET /api/assets/… (serves product imagery)
  server/                         # simulated backend — walled off with `server-only`
    catalog/catalog.json          #   the product catalog (single source of truth)
    catalog/getCatalog.ts         #   the one reader, wrapped in React.cache
    catalog/assets/…              #   product + variant images (served via the API, not /public)
  features/bundle-builder/
    components/builder/           # accordion, product cards, variant chips, steppers
    components/review/            # summary groups, line items, shipping, checkout
    store/                        # reducer state, provider, selectors, persistence
    data/structure.ts             # the 4-step structure (which category feeds which step)
    types.ts                      # Product / Variant / catalog types
    DESIGN.md                     # Figma design spec captured for offline reference
  components/ui/                  # reusable primitives: Button, Badge, PriceTag, QtyStepper, Icon…
```

### Data flow

`catalog.json` is the source of truth. `getCatalog()` (wrapped in `React.cache`) is the **one
place** that reads it — swapping in a real database later means changing only that function.
`page.tsx` loads the catalog on the server and hands it to the client tree; the same loader
backs `GET /api/catalog`. Initial bundle state is **seeded from the catalog** so the app loads
looking exactly like the design (including the pre-populated sensors, accessory, and plan).

### State & persistence

`store/` holds a reducer-based bundle state (`state.ts`) exposed via `BundleProvider` /
`useBundle`. Derived values (line items, totals, savings) live in `store/selectors.ts`.
"Save my system for later" persists **explicitly on click** to `localStorage`
(`store/persistence.ts`) rather than on every keystroke; a saved bundle survives a reload and
takes precedence over the catalog seed.

---

## Notable decisions & tradeoffs

- **Fonts are a free stand-in.** The design specifies two **proprietary, license-required**
  typefaces — **Gilroy** (body/headings) and **TT Norms Pro** (Checkout button) — which can't be
  shipped without a purchased webfont license. The whole app therefore uses **[Manrope](https://fonts.google.com/specimen/Manrope)**
  (a close geometric-sans match) via `next/font`, exposed through one CSS variable,
  `--font-primary`, that every text style reads. **Switching to the licensed fonts** later is a
  local change: drop the `.woff2` files under `src/fonts/`, swap the `next/font/google` import in
  `layout.tsx` for a `next/font/local` one keeping the same `--font-primary` variable — nothing
  else changes.

- **Backend is simulated, not a separate service.** Rather than stand up a real server, the
  catalog and imagery are served from `src/server/` (fenced off from the client by Next's
  `server-only` import) through Next Route Handlers. This satisfies the "serve the JSON from a
  backend" bonus while keeping the repo a single `npm install && npm run dev`.

- **Images come from the API, not `/public`.** Product images live under
  `src/server/catalog/assets/` and are served via `GET /api/assets/…`, so imagery originates from
  the same simulated backend as the catalog — closer to how a real CMS would serve assets.

- **Icons are generated, never hand-written.** See [Icons](#icons) — this keeps `<Icon name=… />`
  typo-proof via a generated `IconName` union.

- **Design fidelity is captured offline.** `DESIGN.md` records the tokens, typography, and
  per-element specs pulled from Figma once, so development didn't depend on live Figma access.

### How this was built — AI-assisted workflow

This project was built with **Claude Code + the Figma MCP**, driven section by section
under my direction — not one-shot generated. The loop for each section:

1. **I instructed, Claude planned.** I described the section and how it should be
   approached, and had Claude generate an **implementation plan** against those
   instructions (reading the Figma design via the Figma MCP).
2. **I reviewed the plan.** I read it, left comments and adjustments, and **approved** it
   before any code was written.
3. **Delegated implementation.** Once approved, I delegated the actual component
   implementation to Claude, building from my instructions and the design.
4. **I reviewed before shipping.** Every change was **reviewed by me** before it landed.
5. **Guardrails in CI.** A **Husky pre-commit pipeline** (format → lint → typecheck →
   build) enforces the code guidelines automatically, so nothing that violates them can be
   committed.

The result: I stayed the reviewer and decision-maker on every section — architecture,
plan, and final code — while Claude handled drafting and implementation within those
guardrails.

### Known limitations

- **Checkout is a placeholder** — the prototype has nowhere to check out to, as the spec allows.
- **Selected-variant chip highlighting is intentionally minimal** — the spec explicitly deprioritized
  chip highlight styling in favor of the selection-and-quantity behavior, which is fully wired.
- Fonts differ from the licensed design until the license is acquired (see above).

---

## Icons

Icons are **generated** from source SVGs into typed React components.

1. Drop a kebab-case SVG into `public/assets/icons/` (e.g. `carrot-down.svg` → name `"carrot-down"`).
2. Run `npm run icons` (`scripts/generate-icons.mjs`).
3. Use it: `<Icon name="camera" size={30} />` — the name is autocompleted and type-checked.

The generator is idempotent: it overwrites `src/components/ui/icon/generated/` and rebuilds
`registry.ts` on each run, so deleted SVGs drop out cleanly. Don't edit anything under
`generated/`. (Icons on React 19 spread `{...props}` with no `forwardRef` — `ref` is an ordinary
prop.) Generated icons are committed, so a clean clone builds without running this step.
