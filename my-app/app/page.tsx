import { existsSync } from "node:fs";
import path from "node:path";
import Rail from "@/components/site/rail";
import { fetchPinterestPhotos } from "@/app/photos/actions";

export const revalidate = 3600;

export default async function Home() {
  const photos = await fetchPinterestPhotos();
  // Drop a transparent PNG at public/desk/cutout.png to use it as the sticker on the desk panel.
  const cutout = existsSync(path.join(process.cwd(), "public", "desk", "cutout.png"));
  return <Rail photos={photos.slice(0, 6)} cutout={cutout} />;
}
