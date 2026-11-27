import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";
import { PROJECTS } from "@/lib/data";

export const metadata = { title: "Projects | Vikranth Jagdish" };

export default function ProjectsPage() {
    return (
        <PageShell title="Projects" kicker="Selected work" lede="Things I have built, mostly for clinics and the people who work in them.">
            <ul className="row-list">
                {PROJECTS.map(p => {
                    const external = p.link.startsWith("http");
                    return (
                        <li key={p.id} className="grid gap-4 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">{p.title}</h2>
                                <p className="text-sm text-[var(--ink-soft)]">{p.kind}</p>
                                <p className="label mt-3 tabular-nums">{p.year}</p>
                            </div>
                            <div>
                                <p className="leading-relaxed text-[#45474c]">{p.description}</p>
                                <p className="label mt-4">{p.stack.join(" · ")}</p>
                                {p.link && (
                                    <Link href={p.link} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="mt-4 inline-flex items-center gap-1 text-sm">
                                        <span className="link">{external ? "Visit site" : "Read the write-up"}</span>
                                        <ArrowUpRight size={13} />
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </PageShell>
    );
}
