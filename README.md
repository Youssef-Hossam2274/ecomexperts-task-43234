This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Fonts

The design specifies two **proprietary** typefaces:

- **Gilroy** — body and headings
- **TT Norms Pro** — the Checkout button

Both are commercial fonts that require a paid **webfont license** to self-host, and
**we do not currently hold that license**, so the real font files are **not shipped
in this repo**. A Figma design that uses Gilroy does not grant the right to use it —
the license must be purchased separately (e.g. via [MyFonts](https://www.myfonts.com),
[Fontspring](https://www.fontspring.com), or the type designer).

**In the meantime, the entire app uses a single free stand-in: [Manrope](https://fonts.google.com/specimen/Manrope)**,
a close geometric-sans match to Gilroy, loaded via [`next/font`](https://nextjs.org/docs/app/api-reference/components/font)
and exposed through one app-wide CSS variable, `--font-primary`, which every text
style reads.

### Switching to the licensed fonts

Once the webfont license is purchased and you have the `.woff2` files:

1. Add the files under `src/fonts/` (e.g. `src/fonts/gilroy/Gilroy-*.woff2`).
2. In `src/app/layout.tsx`, swap the `next/font/google` Manrope import for a
   `next/font/local` call pointing at those files.
3. Keep the same `variable` name (`--font-primary`). Nothing else in the app
   needs to change. (If you also want TT Norms Pro on the Checkout button, add a
   second local font on its own variable and point `Button.tsx` at it.)

## Icons

Icons are **generated** from source SVGs into typed React components — you never
hand-write an icon component. Drop an SVG in, run one command, and it becomes a
fully-typed `<Icon name="…" />`.

### Adding an icon

1. Drop the SVG into `public/assets/icons/`, named in kebab-case
   (e.g. `carrot-down.svg` → the name `"carrot-down"`).
2. Run the generator:

   ```bash
   npm run icons
   ```

3. Use it anywhere — the name is autocompleted and type-checked:

   ```tsx
   import { Icon } from "@/components/ui/icon";

   <Icon name="camera" size={30} />
   <Icon name="camera" color="currentColor" className="text-obsidian" />
   ```

### How it works

`npm run icons` runs `scripts/generate-icons.mjs`, which for every SVG in
`public/assets/icons/`:

- emits a typed component into `src/components/ui/icon/generated/`, and
- rebuilds `src/components/ui/icon/registry.ts` — the name → component map that
  gives `<Icon name=… />` its typo-proof `IconName` union.

Each icon takes a `size` prop (defaults to the SVG's intrinsic size; a `className`
size utility like `size-6` still wins via CSS) and a `color` prop wired to the
icon's primary color — pass `color="currentColor"` to inherit a Tailwind `text-*`
class. Secondary colors stay fixed. Components spread `{...props}` (no `forwardRef` —
this repo is on React 19, where `ref` is an ordinary prop).

The generator is **idempotent**: it fully overwrites `generated/` and `registry.ts`
on each run, so deleted SVGs drop out cleanly. The hand-written files (`types.ts`,
`Icon.tsx`, `index.ts`) are never touched — don't edit anything under `generated/`.

## Bundle Builder

The app is a Wyze security-system bundle builder: a 4-step accordion for
picking cameras/plan/sensors/accessories, feeding a review panel with a
line-item summary and checkout total. Design source: `src/features/bundle-builder/DESIGN.md`.

### Simulated backend

`src/server/` stands in for a real backend/CMS, and is walled off from the
client by Next's `server-only` import:

- `src/server/catalog/catalog.json` — the product catalog (source of truth).
- `src/server/catalog/getCatalog.ts` — the one place that reads it, wrapped in
  `React.cache`. Swapping in a real database later means changing only this
  function.
- `GET /api/catalog` (`src/app/api/catalog/route.ts`) — serves the catalog as
  JSON; statically prerendered since the data doesn't change per request.
- `GET /api/assets/[...path]` — serves product imagery from
  `src/server/catalog/assets/` (not `/public`), so images come from the same
  simulated backend as the catalog API.

### State & persistence

`src/features/bundle-builder/store/` holds a reducer-based bundle state
(`state.ts`) seeded from the catalog, exposed via `BundleProvider` /
`useBundle`. "Save my system for later" persists explicitly to
`localStorage` on click (`store/persistence.ts`) rather than on every change,
so a saved bundle survives a reload and takes precedence over the catalog
seed. Derived values (line items, totals, savings) live in `store/selectors.ts`.

### Review panel

`src/features/bundle-builder/components/review/` renders the order summary:
`SummaryGroup`/`SummaryLineItem` for the grouped line items,
`ShippingLineItem` for the shipping row, `SatisfactionBadge` and
`CheckoutButton` for the right-hand checkout column.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
