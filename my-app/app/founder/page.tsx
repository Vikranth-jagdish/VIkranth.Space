"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useSpring, useTransform, animate, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { EcgLine } from '@/components/motion/ecg-line';
import { ChapterVisual } from '@/components/motion/chapter-visuals';
import { useDecode } from '@/components/motion/founder-hero';
import { FOUNDER_STATS, FOUNDER_CHAPTERS, FOUNDER_ROLE, GLOBAL_SOCIAL_LINKS } from '@/lib/data';
import { playHoverSound, playClickSound } from '@/lib/sound-utils';

const ease = [0.76, 0, 0.24, 1] as const;

// Line of display text that slides up from behind a mask.
function RevealLine({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
                className={`block ${className}`}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease, delay }}
            >
                {children}
            </motion.span>
        </span>
    );
}

function CountUp({ to, prefix = "" }: { to: number; prefix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, to, {
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: v => setValue(Math.round(v))
        });
        return () => controls.stop();
    }, [inView, to]);
    return <span ref={ref}>{prefix}{value}</span>;
}

function DecodeOnView({ text }: { text: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.8 });
    return <span ref={ref}>{inView ? <Decoded text={text} /> : <span className="opacity-0">{text}</span>}</span>;
}

function Decoded({ text }: { text: string }) {
    return <span className="whitespace-pre">{useDecode(text, 0, 40)}</span>;
}

function StatTile({ stat, index }: { stat: typeof FOUNDER_STATS[number]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease, delay: index * 0.1 }}
            onMouseEnter={() => playHoverSound()}
            className="group relative border border-white/10 p-6 md:p-8 bg-black/40 backdrop-blur-sm overflow-hidden hover:border-[var(--color-accent)]/60 transition-colors"
        >
            <div className="absolute inset-0 bg-[var(--color-accent)] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-black/60 mb-6">[ {String(index + 1).padStart(2, "0")} ]</p>
                <p className="text-5xl md:text-6xl font-bold tracking-tighter text-[var(--color-accent)] group-hover:text-black tabular-nums">
                    {stat.value !== null ? <CountUp to={stat.value} prefix={stat.prefix} /> : stat.text}
                </p>
                <p className="mt-3 text-xs uppercase tracking-widest font-bold text-white group-hover:text-black">{stat.label}</p>
                <p className="mt-3 text-xs leading-relaxed text-white/50 group-hover:text-black/70">{stat.detail}</p>
            </div>
        </motion.div>
    );
}

function Chapter({ chapter, index, onActive }: { chapter: typeof FOUNDER_CHAPTERS[number]; index: number; onActive: (i: number) => void }) {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { amount: 0.5 });
    const revealed = useInView(ref, { amount: 0.2, once: true });
    useEffect(() => {
        if (inView) onActive(index);
    }, [inView, index, onActive]);

    const flip = index % 2 === 1;

    return (
        <section ref={ref} id={chapter.id} className="min-h-[80vh] flex items-center py-16 scroll-mt-24">
            <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center w-full ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4"
                    >
                        Chapter {chapter.index}
                    </motion.p>
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-none">
                        <span className="block overflow-hidden">
                            <motion.span
                                className="block"
                                initial={{ y: "100%" }}
                                animate={{ y: revealed ? "0%" : "100%" }}
                                transition={{ duration: 0.9, ease }}
                            >
                                {chapter.title}<span className="text-[var(--color-accent)]">.</span>
                            </motion.span>
                        </span>
                    </h2>
                    <p className="mt-4 text-sm uppercase tracking-widest text-[var(--color-accent)]">
                        <DecodeOnView text={chapter.kicker} />
                    </p>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-6 text-sm md:text-base leading-relaxed text-white/60 max-w-md"
                    >
                        {chapter.body}
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease }}
                >
                    <ChapterVisual id={chapter.id} />
                </motion.div>
            </div>
        </section>
    );
}

export default function FounderPage() {
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(heroProgress, [0, 1], ["0%", reduce ? "0%" : "30%"]);
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
    const [activeChapter, setActiveChapter] = useState(0);
    const handleActive = React.useCallback((i: number) => setActiveChapter(i), []);

    const email = GLOBAL_SOCIAL_LINKS.email;

    return (
        <div className="relative w-full font-mono text-white selection:bg-[var(--color-accent)] selection:text-black">
            {/* Scroll progress */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-accent)] origin-left z-[60]"
                style={{ scaleX: progress }}
            />

            <nav className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center text-xs uppercase">
                <Link
                    href="/"
                    onClick={() => playClickSound()}
                    className="flex items-center gap-2 text-[var(--color-accent)] hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft size={14} /> Back
                </Link>
                <span className="text-[10px] tracking-[0.3em] text-white/40 hidden md:block">Co-founder story / HealthPilot.ai</span>
            </nav>

            {/* Chapter rail */}
            <aside className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
                {FOUNDER_CHAPTERS.map((c, i) => (
                    <a
                        key={c.id}
                        href={`#${c.id}`}
                        className="group flex items-center gap-3 text-[10px] tracking-[0.2em]"
                    >
                        <span className={`h-px transition-all duration-500 ${activeChapter === i ? 'w-10 bg-[var(--color-accent)]' : 'w-4 bg-white/30 group-hover:w-6'}`} />
                        <span className={`transition-colors ${activeChapter === i ? 'text-[var(--color-accent)]' : 'text-white/30 group-hover:text-white/60'}`}>
                            {c.index} {c.title}
                        </span>
                    </a>
                ))}
            </aside>

            {/* Hero */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-4 md:px-12 lg:px-40 overflow-hidden">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-6xl">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50 mb-6"
                    >
                        Co-founder · Head of Product & Tech · HealthPilot.ai
                    </motion.p>
                    <h1 className="text-[16vw] md:text-[11vw] lg:text-[9vw] font-bold tracking-tighter leading-[0.85]">
                        <RevealLine delay={0.1}>FROM 0</RevealLine>
                        <RevealLine delay={0.25} className="text-[var(--color-accent)]">TO PMF.</RevealLine>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.7 }}
                        className="mt-8 max-w-xl text-sm md:text-base leading-relaxed text-white/60"
                    >
                        I built HealthPilot&apos;s team from zero to fifteen, rebuilt the product until it clicked with doctors, and took it into two large hospitals. Along the way I headed both product and engineering.
                    </motion.p>
                </motion.div>

                <div className="absolute inset-x-0 bottom-28 opacity-70">
                    <EcgLine className="w-full h-20" duration={2.6} />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40"
                >
                    Scroll
                    <motion.span
                        animate={reduce ? undefined : { y: [0, 8, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        className="block w-px h-8 bg-gradient-to-b from-[var(--color-accent)] to-transparent"
                    />
                </motion.div>
            </section>

            {/* Stats */}
            <section className="px-4 md:px-12 lg:px-40 py-24">
                <div className="max-w-6xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">By the numbers</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {FOUNDER_STATS.map((s, i) => <StatTile key={s.label} stat={s} index={i} />)}
                    </div>
                </div>
            </section>

            {/* Big marquee */}
            <div className="relative py-10 overflow-hidden border-y border-white/10 select-none" aria-hidden="true">
                <div className="marquee-track flex w-max text-6xl md:text-8xl font-bold tracking-tighter">
                    {Array.from({ length: 2 }).flatMap((_, k) =>
                        ["BUILD", "SHIP", "LEARN", "REBUILD"].map((w, i) => (
                            <span key={`${k}-${i}`} className="flex items-center gap-10 pr-10 whitespace-nowrap">
                                <span className={i % 2 === 0 ? 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]' : 'text-white'}>{w}</span>
                                <span className="text-[var(--color-accent)] text-4xl">✦</span>
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Chapters */}
            <div className="px-4 md:px-12 lg:px-40">
                <div className="max-w-6xl">
                    {FOUNDER_CHAPTERS.map((c, i) => (
                        <Chapter key={c.id} chapter={c} index={i} onActive={handleActive} />
                    ))}
                </div>
            </div>

            {/* Role */}
            <section className="px-4 md:px-12 lg:px-40 py-24 border-t border-white/10">
                <div className="max-w-6xl grid md:grid-cols-2 gap-12">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">The role</p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                            HEAD OF<br />PRODUCT<br /><span className="text-[var(--color-accent)]">&amp; TECH.</span>
                        </h2>
                        <p className="mt-6 text-sm leading-relaxed text-white/60 max-w-sm">
                            I owned the whole path from a doctor&apos;s problem to shipped code: deciding what to build, designing how it works, and hiring the people to build it.
                        </p>
                    </div>
                    <ul className="flex flex-col">
                        {FOUNDER_ROLE.map((r, i) => (
                            <motion.li
                                key={r}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.8 }}
                                transition={{ duration: 0.6, ease, delay: i * 0.06 }}
                                onMouseEnter={() => playHoverSound()}
                                className="group relative flex items-center justify-between border-b border-white/10 py-4 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-[var(--color-accent)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
                                <span className="relative text-sm md:text-base uppercase tracking-wide group-hover:text-black transition-colors">{r}</span>
                                <span className="relative text-[10px] text-white/30 group-hover:text-black tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* CTA */}
            <section className="relative px-4 md:px-12 lg:px-40 py-32 overflow-hidden">
                <div className="max-w-6xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">What&apos;s next</p>
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
                        LET&apos;S BUILD<br /><span className="text-[var(--color-accent)]">SOMETHING.</span>
                    </h2>
                    <div className="mt-12 flex flex-wrap gap-4">
                        <a
                            href={email}
                            onClick={() => playClickSound()}
                            className="group inline-flex items-center gap-3 bg-[var(--color-accent)] text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:gap-5 transition-all"
                        >
                            Get in touch <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
                        </a>
                        <a
                            href="https://healthpilot.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playClickSound()}
                            className="group inline-flex items-center gap-3 border border-white/20 px-6 py-4 text-xs font-bold uppercase tracking-widest hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                        >
                            HealthPilot.ai <ArrowUpRight size={14} />
                        </a>
                        <a
                            href={GLOBAL_SOCIAL_LINKS.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playClickSound()}
                            className="group inline-flex items-center gap-3 border border-white/20 px-6 py-4 text-xs font-bold uppercase tracking-widest hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                        >
                            LinkedIn <ArrowUpRight size={14} />
                        </a>
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-6 opacity-40">
                    <EcgLine className="w-full h-12" />
                </div>
            </section>
        </div>
    );
}
