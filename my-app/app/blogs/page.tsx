import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";
import { BLOGS } from "@/lib/data";

export const metadata = { title: "Writing | Vikranth Jagdish" };

const fmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export default function BlogsPage() {
    return (
        <PageShell title="Notes" kicker="Writing" lede="Things I learned while building, written in plain words.">
            <ul className="row-list">
                {BLOGS.map(b => (
                    <li key={b.slug}>
                        <Link href={`/blogs/${b.slug}`} className="group grid gap-2 py-7 md:grid-cols-[130px_1fr] md:gap-10">
                            <span className="label tabular-nums md:pt-1.5">{fmt.format(new Date(b.date))}</span>
                            <span>
                                <span className="block text-xl font-semibold tracking-tight decoration-[var(--ink)] underline-offset-4 group-hover:underline">{b.title}</span>
                                <span className="mt-2 block max-w-xl leading-relaxed text-[var(--ink-soft)]">{b.preview}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </PageShell>
    );
}
