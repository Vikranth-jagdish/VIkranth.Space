import { existsSync } from "node:fs";
import path from "node:path";
import Rail from "@/components/site/rail";
import { fetchPinterestPhotos } from "@/app/photos/actions";
import { getTypingStats } from "@/lib/typing";

export const revalidate = 3600;

export default async function Home() {
  const [photos, typing] = await Promise.all([fetchPinterestPhotos(), getTypingStats("VikranthJagdish")]);
  // Drop a transparent PNG at public/desk/cutout.png to use it as the sticker on the desk panel.
  const cutout = existsSync(path.join(process.cwd(), "public", "desk", "cutout.png"));
  return <Rail photos={photos.slice(0, 9)} cutout={cutout} typing={typing} />;
}
