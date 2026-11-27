import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";
import { LABS } from "@/lib/data";

export const metadata = { title: "Labs | Vikranth Jagdish" };

export default function LabsPage() {
    return (
        <PageShell title="Labs" kicker="Experiments" lede="Side projects and the tools I run for myself.">
            <ul className="row-list">
                {LABS.map(l => {
                    const external = l.link.startsWith("http");
                    return (
                        <li key={l.id}>
                            <Link href={l.link} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="group grid gap-2 py-7 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-10">
                                <span>
                                    <span className="block text-xl font-semibold tracking-tight">{l.title}</span>
                                    <span className="text-sm text-[var(--ink-soft)]">{l.kind}</span>
                                </span>
                                <span className="leading-relaxed text-[#45474c]">{l.description}</span>
                                <span className="label inline-flex items-center gap-2 tabular-nums">{l.year}<ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </PageShell>
    );
}
