import { PageShell } from "@/components/site/page-shell";
import { fetchPinterestPhotos } from "@/app/photos/actions";

export const metadata = { title: "Photos | Vikranth Jagdish" };
export const revalidate = 3600;

const BOARD_URL = "https://in.pinterest.com/unbalanceddiode/my-pictures/";

export default async function PhotosPage() {
    const photos = await fetchPinterestPhotos();
    return (
        <PageShell title="Photos" kicker="Off hours" lede="Things I stopped to look at." wide>
            {photos.length > 0 ? (
                <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                    {photos.map(p => (
                        <a key={p.id} href={p.link || BOARD_URL} target="_blank" rel="noreferrer" className="mb-4 block break-inside-avoid">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.src} alt={p.alt} loading="lazy" className="w-full transition-opacity hover:opacity-85" />
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-[var(--ink-soft)]">The photos could not be loaded just now.</p>
            )}
            <p className="mt-12 text-sm text-[var(--ink-soft)]">
                The full board is on <a href={BOARD_URL} target="_blank" rel="noreferrer" className="link text-[var(--ink)]">Pinterest</a>.
            </p>
        </PageShell>
    );
}
