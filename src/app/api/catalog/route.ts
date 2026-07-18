import { getCatalog } from "@/src/server/catalog/getCatalog";

// The catalog is static product data, so this endpoint can be prerendered and
// cached rather than re-run per request.
export const dynamic = "force-static";

/** `GET /api/catalog` — serves the product catalog as JSON. */
export async function GET() {
  return Response.json(await getCatalog());
}
