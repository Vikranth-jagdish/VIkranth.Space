import { PageShell } from "@/components/site/page-shell";
import TopTracksList from "@/components/ui/top-tracks-list";
import GithubStats from "@/components/ui/github-stats";
import { SOCIAL_LINKS } from "@/lib/data";

export const metadata = { title: "Stats | Vikranth Jagdish" };

function Heading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
    return (
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-[var(--hair)] pb-3">
            <h2 className="label">{title}</h2>
            {href && <a href={href} target="_blank" rel="noreferrer" className="link text-sm">{linkLabel}</a>}
        </div>
    );
}

export default function StatsPage() {
    return (
        <PageShell title="Stats" kicker="Live numbers" lede="Code, typing and music, updated as they happen." wide>
            <div className="space-y-16">
                <section>
                    <Heading title="GitHub activity" href={SOCIAL_LINKS.github} linkLabel="Profile" />
                    <GithubStats />
                </section>
                <div className="grid gap-12 md:grid-cols-2">
                    <section>
                        <Heading title="Typing speed" href="https://monkeytype.com/profile/VikranthJagdish" linkLabel="Monkeytype" />
                        <a href="https://monkeytype.com/profile/VikranthJagdish" target="_blank" rel="noreferrer" className="block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                alt="My Monkeytype stats"
                                src="https://monkeytype-readme.zeabur.app/generate-svg/VikranthJagdish/serika?lbpb=true"
                                className="h-auto w-full"
                            />
                        </a>
                    </section>
                    <section>
                        <Heading title="Top tracks, last 4 weeks" />
                        <TopTracksList />
                    </section>
                </div>
                <section>
                    <Heading title="Playlist" />
                    <iframe
                        title="Spotify playlist"
                        src="https://open.spotify.com/embed/playlist/3inAeOAlPSTP3favtJ7dF7?utm_source=generator"
                        width="100%"
                        style={{ minHeight: 360, border: 0, borderRadius: 12 }}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    />
                </section>
            </div>
        </PageShell>
    );
}
