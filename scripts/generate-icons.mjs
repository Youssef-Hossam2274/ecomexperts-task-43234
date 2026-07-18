// @ts-check
/**
 * Icon generator.
 *
 * Reads every SVG in `public/assets/icons/`, and for each one emits a typed
 * React component into `src/components/ui/icon/generated/`. Also regenerates
 * `registry.ts` — the name -> component map that gives `<Icon name=... />` its
 * autocompleted, typo-proof `IconName` union.
 *
 * Design notes:
 *  - Colors are PRESERVED from the source SVG. The icon's *primary* color (the
 *    one used for its strokes, or otherwise its most common color) is wired to a
 *    `color` prop so callers can recolor it — e.g. `color="currentColor"` to
 *    inherit a Tailwind `text-*` class. Secondary colors stay fixed.
 *  - `size` drives width/height (defaulting to the source SVG's own width);
 *    a `className` size-* utility still overrides it via CSS.
 *  - No `forwardRef` — this repo is on React 19, where `ref` is an ordinary
 *    prop, so components simply spread `{...props}`.
 *
 * Run with: `npm run icons`. Idempotent — safe to re-run; it fully overwrites
 * `generated/` and `registry.ts`. The hand-written files (`types.ts`, `Icon.tsx`,
 * `index.ts`) are never touched.
 */
import { transform } from "@svgr/core";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SVG_DIR = path.join(ROOT, "public/assets/icons");
const OUT_DIR = path.join(ROOT, "src/components/ui/icon");
const GEN_DIR = path.join(OUT_DIR, "generated");

const BANNER =
  "// AUTO-GENERATED — do not edit. Run `npm run icons` to update.";

/**
 * `carrot-down` -> `CarrotDown`
 * @param {string} kebab
 */
const toPascalCase = (kebab) =>
  kebab
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");

/**
 * Default square size for an icon — its intrinsic width, else the viewBox width.
 * @param {string} svg
 */
function detectDefaultSize(svg) {
  const width = svg.match(/\bwidth="(\d+(?:\.\d+)?)"/);
  if (width) return Math.round(Number(width[1]));
  const viewBox = svg.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+) [\d.]+"/);
  if (viewBox) return Math.round(Number(viewBox[1]));
  return 24;
}

/** @param {string} hex */
const isMeaningfulColor = (hex) =>
  !["#fff", "#ffffff", "#000", "#000000"].includes(hex.toLowerCase());

/**
 * The icon's primary (recolorable) color: the most common color used in
 * `stroke=` attributes, else the most common `fill=` color. White/black (clip
 * rects, masks) are ignored. Returns `null` when the SVG has no such color.
 * @param {string} svg
 */
function detectPrimaryColor(svg) {
  /** @param {string} attr */
  const tally = (attr) => {
    const counts = new Map();
    const re = new RegExp(`${attr}="(#[0-9a-fA-F]{3,8})"`, "g");
    for (const [, hex] of svg.matchAll(re)) {
      if (isMeaningfulColor(hex)) counts.set(hex, (counts.get(hex) ?? 0) + 1);
    }
    return counts;
  };
  /** @param {Map<string, number>} counts */
  const pickMostCommon = (counts) =>
    [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return pickMostCommon(tally("stroke")) ?? pickMostCommon(tally("fill"));
}

/** @param {{ componentName: string, prefix: string, svg: string }} args */
async function generateComponent({ componentName, prefix, svg }) {
  const defaultSize = detectDefaultSize(svg);
  const primaryColor = detectPrimaryColor(svg);

  /** @type {Record<string, string>} */
  const replaceAttrValues = {};
  if (primaryColor) {
    replaceAttrValues[primaryColor] = `{color ?? "${primaryColor}"}`;
  }

  /** @type {import("@svgr/babel-plugin-transform-svg-component").Template} */
  const template = (variables, { tpl }) => tpl`
import type { IconProps } from "../types";

export function ${variables.componentName}({ size, color, ...props }: IconProps) {
  return ${variables.jsx};
}
`;

  const code = await transform(
    svg,
    {
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      jsxRuntime: "automatic",
      typescript: true,
      dimensions: false,
      expandProps: "end",
      svgProps: {
        width: `{size ?? ${defaultSize}}`,
        height: `{size ?? ${defaultSize}}`,
      },
      replaceAttrValues,
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              // Keep colors byte-exact so `replaceAttrValues` matches, and keep
              // the viewBox so the icon scales with `size`.
              overrides: { convertColors: false, removeViewBox: false },
            },
          },
          // Prefix ids (e.g. clip paths) per file so multiple icons rendered on
          // one page never collide on a shared `id`.
          { name: "prefixIds", params: { prefix } },
        ],
      },
      template,
    },
    { componentName },
  );

  return `${BANNER}\n${code}`;
}

async function main() {
  const files = (await readdir(SVG_DIR))
    .filter((f) => f.endsWith(".svg"))
    .sort();

  if (files.length === 0) {
    console.error(`No SVGs found in ${path.relative(ROOT, SVG_DIR)}`);
    process.exit(1);
  }

  // Rebuild generated/ from scratch so deleted SVGs drop out cleanly.
  if (existsSync(GEN_DIR)) await rm(GEN_DIR, { recursive: true });
  await mkdir(GEN_DIR, { recursive: true });

  /** @type {{ key: string, componentName: string }[]} */
  const icons = [];

  for (const file of files) {
    const key = path.basename(file, ".svg"); // registry key, e.g. "carrot-down"
    const componentName = toPascalCase(key);
    const svg = await readFile(path.join(SVG_DIR, file), "utf8");

    const code = await generateComponent({ componentName, prefix: key, svg });
    await writeFile(path.join(GEN_DIR, `${componentName}.tsx`), code, "utf8");

    icons.push({ key, componentName });
    console.log(`  ✓ ${file} -> generated/${componentName}.tsx`);
  }

  const imports = icons
    .map(
      (i) =>
        `import { ${i.componentName} } from "./generated/${i.componentName}";`,
    )
    .join("\n");
  const entries = icons
    .map((i) => `  ${JSON.stringify(i.key)}: ${i.componentName},`)
    .join("\n");

  const registry = `${BANNER}
${imports}

export const ICONS = {
${entries}
} as const;

export type IconName = keyof typeof ICONS;
`;

  await writeFile(path.join(OUT_DIR, "registry.ts"), registry, "utf8");
  console.log(`\nGenerated ${icons.length} icons + registry.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
