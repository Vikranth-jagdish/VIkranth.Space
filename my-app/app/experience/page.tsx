import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { EXPERIENCE, SOCIAL_LINKS } from "@/lib/data";

export const metadata = { title: "Experience | Vikranth Jagdish" };

export default function ExperiencePage() {
    return (
        <PageShell title="Experience" kicker="Career" lede="Co-founder of HealthPilot, where I lead product and tech. Alongside that, engineering work and leadership roles in the student startup community.">
            <ol className="row-list">
                {EXPERIENCE.map(item => (
                    <li key={item.id} className="grid gap-3 py-8 md:grid-cols-[150px_1fr] md:gap-10">
                        <div>
                            <p className="label tabular-nums">{item.years}</p>
                            <p className="label mt-1">{item.place}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
                            <a href={item.link} target="_blank" rel="noreferrer" className="group mt-1 inline-flex items-center gap-1 text-sm text-[var(--ink-soft)]">
                                <span className="link">{item.company}</span>
                                <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                <span className="ml-2">{item.kind}</span>
                            </a>
                            <p className="mt-4 max-w-xl leading-relaxed text-[#45474c]">{item.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
            <p className="mt-12 text-sm text-[var(--ink-soft)]">
                The full picture is on <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="link text-[var(--ink)]">LinkedIn</a>.
            </p>
        </PageShell>
    );
}
