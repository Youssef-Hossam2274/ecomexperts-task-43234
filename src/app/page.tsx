import { BundleBuilder } from "@/src/features/bundle-builder/components/BundleBuilder";
import { getCatalog } from "@/src/server/catalog/getCatalog";

export default async function Home() {
  // Fetched on the server and handed to the client tree as a prop. The same
  // loader also backs the `GET /api/catalog` Route Handler.
  const catalog = await getCatalog();
  return <BundleBuilder catalog={catalog} />;
}
