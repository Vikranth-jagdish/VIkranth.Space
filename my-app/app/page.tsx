import Rail from "@/components/site/rail";
import { fetchPinterestPhotos } from "@/app/photos/actions";

export const revalidate = 3600;

export default async function Home() {
  const photos = await fetchPinterestPhotos();
  return <Rail photos={photos.slice(0, 6)} />;
}
