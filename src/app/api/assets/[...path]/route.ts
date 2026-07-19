import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Serves brand/product imagery from `src/server/catalog/assets` instead of
 * Next's static `/public` folder, so images come from the same simulated
 * backend as `/api/catalog` (see `src/server/catalog/getCatalog.ts`, which
 * rewrites `product.image` to point here).
 */
const ASSETS_ROOT = path.join(process.cwd(), "src/server/catalog/assets");

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const resolved = path.normalize(path.join(ASSETS_ROOT, ...segments));

  // Guard against path traversal escaping the assets root (e.g. "../../..").
  if (
    resolved !== ASSETS_ROOT &&
    !resolved.startsWith(ASSETS_ROOT + path.sep)
  ) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(resolved).toLowerCase()];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(resolved);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
