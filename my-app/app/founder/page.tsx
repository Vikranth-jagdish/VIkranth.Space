"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { FOUNDER_CHAPTERS, FOUNDER_ROLE, SOCIAL_LINKS } from "@/lib/data";

export default function FounderPage() {
    return (
        <PageShell
            title="From zero to product-market fit"
            kicker="Co-founder story · HealthPilot"
            lede="I built HealthPilot's team from nothing, rebuilt the product until it clicked with doctors, and took it into hospitals. Along the way I led both product and engineering."
        >
            <ol>
                {FOUNDER_CHAPTERS.map((c, i) => (
                    <motion.li
                        key={c.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="grid gap-4 border-t border-[var(--hair)] py-12 md:grid-cols-[1fr_1.4fr] md:gap-12"
                    >
                        <div>
                            <p className="label tabular-nums">Chapter {i + 1}</p>
                            <h2 className="mt-2 text-5xl font-semibold tracking-[-0.04em] leading-none md:text-6xl">{c.title}</h2>
                        </div>
                        <div>
                            <p className="hand text-[var(--blue)] !text-[24px]">{c.kicker}</p>
                            <p className="mt-4 max-w-md leading-relaxed text-[#45474c]">{c.body}</p>
                        </div>
                    </motion.li>
                ))}
            </ol>

            <section className="grid gap-8 border-t border-[var(--hair)] py-12 md:grid-cols-[1fr_1.4fr] md:gap-12">
                <div>
                    <p className="label">The role</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] leading-tight">Head of Product &amp; Tech</h2>
                    <p className="mt-4 max-w-sm leading-relaxed text-[#45474c]">
                        I owned the whole path from a doctor&apos;s problem to shipped code: deciding what to build, designing how it works, and hiring the people to build it.
                    </p>
                </div>
                <ul className="row-list self-start">
                    {FOUNDER_ROLE.map(r => <li key={r} className="py-3">{r}</li>)}
                </ul>
            </section>

            <section className="border-t border-[var(--hair)] pt-12">
                <h2 className="text-4xl font-semibold tracking-[-0.04em] leading-none md:text-5xl">Let&apos;s build something.</h2>
                <p className="mt-4 select-all font-mono text-sm">{SOCIAL_LINKS.email}</p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <a href="https://healthpilot.ai" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1"><span className="link">HealthPilot</span><ArrowUpRight size={13} /></a>
                    <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1"><span className="link">LinkedIn</span><ArrowUpRight size={13} /></a>
                </div>
            </section>
        </PageShell>
    );
}
