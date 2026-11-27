import { PageShell } from "@/components/site/page-shell";
import TopTracksList from "@/components/ui/top-tracks-list";
import GithubStats from "@/components/ui/github-stats";
import { SOCIAL_LINKS } from "@/lib/data";
import { getTypingStats } from "@/lib/typing";

export const metadata = { title: "Stats | Vikranth Jagdish" };

function Heading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
    return (
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-[var(--hair)] pb-3">
            <h2 className="label">{title}</h2>
            {href && <a href={href} target="_blank" rel="noreferrer" className="link text-sm">{linkLabel}</a>}
        </div>
    );
}

export const revalidate = 3600;

export default async function StatsPage() {
    const typing = await getTypingStats("VikranthJagdish");
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
{typing ? (
                            <div>
                                <div className="grid grid-cols-3 gap-4">
                                    {typing.bests.map(b => (
                                        <div key={b.seconds}>
                                            <p className="text-5xl font-semibold tracking-[-0.04em] leading-none tabular-nums">{b.wpm}</p>
                                            <p className="label mt-2">wpm · {b.seconds}s</p>
                                            <p className="mt-1 text-sm text-[var(--ink-soft)] tabular-nums">{b.acc}% accuracy</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 text-sm text-[var(--ink-soft)] tabular-nums">
                                    {typing.tests.toLocaleString("en-US")} tests completed, about {typing.hours} hours of typing.
                                </p>
                            </div>
                        ) : (
                            <p className="text-[var(--ink-soft)]">Typing stats are not available right now.</p>
                        )}
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
