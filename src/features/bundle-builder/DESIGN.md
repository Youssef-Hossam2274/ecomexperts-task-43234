# Bundle Builder — Design Spec

Captured once from Figma so we don't need the MCP again during development.

- **Figma file:** `Frontend-Test-Figma (Copy)` — key `Li84eCjOyv17AaovfF567g`
- **Node:** `70:14135` (root frame `Frame1736`)
- **Screen:** Wyze security-system bundle builder ("Build your bundle") + order summary
- **Fonts:** Gilroy (Regular, RegularItalic, Medium, SemiBold, Bold), TT Norms Pro (Bold — Checkout button only)

---

## 1. Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| core / wyze purple | `#4E2FD2` | Primary brand: prices, selected borders, badges, buttons, "Unlimited" |
| Gray-C / Obsidian | `#0B0D10` | Product titles, qty numbers |
| Gray-C / 700 | `#525963` | — |
| Gray-C / 600 | `#6F7882` | Strikethrough prices in summary |
| Gray-C / 500 | `#A8B2BD` | Summary section labels (CAMERAS, SENSORS…) |
| Gray-C / 400 | `#CED6DE` | Summary row dividers, disabled qty border |
| Gray-C / 300 | `#E6EBF0` | Qty stepper "minus" border (active card) |
| Gray-C / 200 | `#F0F4F7` | Qty "add" button bg |
| utility / gray-70 | `#575757` | Card price (current) |
| — | `#484848` | Step labels ("STEP 1 OF 4"), "Save for later" |
| — | `#1F1F1F` | Card body text / headings, section borders |
| — | `#D8392B` | Strikethrough (old) price on cards |
| — | `#0AA288` | "Congrats you're saving" text, White swatch border |
| — | `#00EE00`→ actually `#00E` | "Learn More" links (blue underline) |
| — | `#EDF4FF` | Section panel background (light blue) |
| — | `#FFFFFF` | Card backgrounds, page bg |
| — | `rgba(78,47,210,0.7)` | Selected camera card border |
| — | `rgba(31,31,31,0.75)` | Card description text |

### Typography
| Style | Font | Size / line-height | Notes |
|---|---|---|---|
| Section heading | Gilroy-SemiBold | 28px / leading-none | "Choose your cameras", "Your security system" |
| Step label | Gilroy-Medium | 12px, tracking 1.6px, uppercase | "STEP 1 OF 4" |
| Card title (big) | Gilroy-SemiBold | 18px | Wyze Cam v4, Pan v3, etc. |
| Card title (small) | Gilroy-SemiBold | 16px | Floodlight (longer name) |
| Card description | Gilroy-Medium | 14px / 1.3 (12px on floodlight) | color rgba(31,31,31,.75) |
| Price current | Gilroy-Regular/SemiBold | 16px | purple in summary, gray on card |
| Price old (strike) | Gilroy-Regular/Medium | 16px, line-through | red on card, gray in summary |
| Swatch label | Gilroy-Medium | 10px, tracking 0.6px | White / Grey / Black |
| Qty number | Gilroy-Medium/SemiBold | 16px (cards) / 14px (summary) | |
| Summary label | Gilroy-Regular | 12px, tracking 0.36px, uppercase | color #A8B2BD |
| Grand total | Gilroy-Bold | 28px / 32px | purple |
| Checkout button | TT Norms Pro Bold | 17px | white |

### Radii & spacing
- Panels / cards: `rounded-[10px]`
- Badges ("Save 22%"): `rounded-[10px]`, padding `2px 6px`
- Swatch chips: `rounded-[2px]`, height 26px, width ~65px, border 0.5px
- Qty stepper buttons: `rounded-[4px]`, `size-20px`; icons 8px
- Buttons: `rounded-[7px]` (Next) / `rounded-[4px]` (Checkout)
- Content max width column: `1213px`, left offset `calc(8.33% - 15px)`

---

## 2. Layout Structure

Two stacked regions inside the page (both `w-[1213px]`, centered-ish via left offset):

### A. Accordion — 4 steps (top, y≈49px)
Vertical stack, gap 13px. Each step = light-blue panel (`#EDF4FF`, rounded 10px) with:
- Step label row ("STEP n OF 4")
- Header row: icon (30px) + title (28px) + right control

Only **Step 1 is expanded**; steps 2–4 are collapsed (just header + down-carrot `12/carrot-down`).

**Step 1 — "Choose your cameras"** (expanded):
- Header: livestream cam icon + title + right side "2 selected" (purple 14px) + up-carrot
- Product grid: **5 camera cards** in a horizontal row, gap 15px, each `flex-1`
- Below grid: outlined button "Next: Choose your sensors" (purple border, `rounded-7px`, text 18px)

**Step 2 — "Choose your plan"** (collapsed) — icon `logo_hms_new`
**Step 3 — "Choose your sensors"** (collapsed) — icon Group1417
**Step 4 — "Add extra protection"** (collapsed) — icon Group1418

### B. Order summary panel (bottom, y≈886px)
Light-blue panel, two columns, gap 52px:

**Left column (`w-552px`) — line items** grouped by category, each group separated by top border `#CED6DE`:
- Heading "Your security system" (28px) + subtitle
- **CAMERAS**, **SENSORS**, **ACCESSORIES**, **PLAN**, and a shipping row
- Each line: thumbnail (41px, rounded 5px) + name (18px) + qty stepper (72px wide) + price(s)

**Right column (`w-486px`) — checkout summary:**
- Satisfaction badge (131px) + "30-day hassle-free returns" copy
- Row: "as low as $19.19/mo" purple pill  +  strike `$238.81` / total `$187.89` (28px purple bold)
- Green line: "Congrats! You're saving $50.92 on your security bundle!"
- **Checkout** button (full width, purple `#4E2FD2`, rounded 4px, TT Norms Pro Bold 17px white)
- "Save my system for later" (italic underline, centered)

---

## 3. Product / Content Data

### Camera cards (Step 1 grid)
| # | Name | Description | Badge | Colors (swatches) | Qty | Old price | Price |
|---|---|---|---|---|---|---|---|
| 1 | Wyze Cam v4 | The clearest Wyze Cam ever made. *Learn More* | Save 22% | White, Grey, Black | 1 | $35.98 | **$27.98** |
| 2 | Wyze Cam Pan v3 | 360° pan and 180° tilt security camera. | Save 12% | White, Black | 2 | $39.98 | **$34.98** |
| 3 | Wyze Cam Floodlight v2 | 2K floodlight camera w/ 160° wide-angle view for your garage. | Save 22% | White, Black | 0 | $89.98 | **$69.98** |
| 4 | Wyze Duo Cam Doorbell | Two cameras. Two views. Double the porch protection. | — | (none) | 0 | — | $69.98 |
| 5 | Wyze Battery Cam Pro | Protect anywhere. See everything in 2.5K HDR. No power outlet or electrician needed. | — | White, Black | 0 | — | $89.98 |

- Cards **1 & 2** are "selected" → purple border `2px rgba(78,47,210,0.7)` + light interior; hence "2 selected".
- Swatch chip: little product image (22–28px) + color name; White swatch has green-tinted border `#0AA288`.
- Qty stepper: `[ − ] n [ + ]`, minus disabled/greyed when n=0.

### Order summary line items
**CAMERAS**
- Wyze Cam v4 — qty 1 — ~~$35.98~~ **$27.98**
- Wyze Cam Pan v3 — qty 2 — ~~$57.98~~ **$47.98**

**SENSORS**
- Wyze Sense Motion Sensor — qty 2 — **$59.98**
- Wyze Sense Hub (Required) — qty 1 (stepper disabled) — ~~$29.92~~ **FREE**

**ACCESSORIES**
- Wyze MicroSD Card (256GB) — qty 2 — **$41.96**

**PLAN**
- Cam **Unlimited** — ~~$12.99/mo~~ **$9.99/mo**

**SHIPPING** (no label header)
- Fast Shipping — ~~$5.99~~ **FREE**

**Totals:** subtotal strike `$238.81` → total **$187.89**; savings **$50.92**; financing "as low as $19.19/mo".

---

## 4. Reusable Components (to build)

- `StepAccordion` / `AccordionSection` — expanded + collapsed states, step label, header icon+title, right control (carrot / "n selected")
- `ProductCard` — image, save badge, title, description + Learn More, color-swatch chips, qty stepper, price (old/new)
- `ColorSwatchChip` — thumbnail + label, selectable, White variant has green border
- `QtyStepper` — `[− n +]`, two variants:
  - `card` (builder cards + step rows, on white): outlined minus + filled-grey add.
  - `review` (order-summary rows, on the light-blue panel): flat 3-up control in
    a fixed 72px column; enabled = white buttons, required-item (disabled) = both
    buttons grey with a `#CED6DE` border. (Figma steppers `74:21670` / `74:21683`.)
- `SummaryLineItem` — thumbnail, name, qty stepper (optional), price(s)
- `SummaryGroup` — top border + uppercase label + items
- `PriceTag` — old (strikethrough) + current, "FREE" variant
- `SatisfactionBadge`, `SavingsBanner`, `CheckoutButton`, `Badge` (Save %)

---

## 5. Assets

Figma asset URLs **expire ~7 days** — download & commit before relying on them. Key assets:

| Asset | Node name |
|---|---|
| Wyze Cam v4 hero | `Wyze_Cam_V4_01.0001.png` |
| Cam Pan v3 hero | `image 13` |
| Floodlight v2 hero | `image 16` |
| Duo Cam Doorbell hero | `image 110` |
| Battery Cam Pro hero | `image 112` |
| Motion Sensor / Hub | `Wyze Sense Motion Sensor`, `Wyze Sense Hub` |
| MicroSD card | `Black 256GB microSD…` |
| Satisfaction badge | `Satisfaction Badge-05 1` |
| Cam Plus/Unlimited logo | `Layer_1`, `logo_hms_new 1` |
| Icons | `icon/24/cam/livestream`, `12/carrot-up`, `12/carrot-down`, `12/add`, `12/minus`, `carbon:delivery` (shipping) |

> Re-fetch via Figma MCP `get_design_context` / `download_assets` on node `70:14135`, file `Li84eCjOyv17AaovfF567g`, only if assets are needed and links have expired.
