import { PageShell } from "@/components/site/page-shell";
import { VideoTile } from "@/components/site/video-tile";
import { SOCIAL_LINKS, VIDEOS } from "@/lib/data";

export const metadata = { title: "Videos | Vikranth Jagdish" };

export default function VideosPage() {
    const piano = VIDEOS.filter(v => v.kind === "Piano");
    const edits = VIDEOS.filter(v => v.kind === "Edit");
    return (
        <PageShell title="Videos" kicker="Off hours" lede="Piano covers recorded at home, and the occasional video edit." wide>
            <section>
                <div className="mb-6 flex items-baseline justify-between gap-4">
                    <h2 className="label">Piano</h2>
                    <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noreferrer" className="link text-sm">YouTube channel</a>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                    {piano.map(v => <VideoTile key={v.id} video={v} />)}
                </div>
            </section>
            <section className="mt-16">
                <h2 className="label mb-6">Edits</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {edits.map(v => <VideoTile key={v.id} video={v} />)}
                </div>
            </section>
        </PageShell>
    );
}
