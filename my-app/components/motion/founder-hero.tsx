"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { playClickSound } from '@/lib/sound-utils';
import { getBootDelay } from './boot-sequence';

const CHARS = "!<>-_\\/[]{}—=+*^?#01";

// Resolves text left-to-right out of random glyphs. `speed` is ms per revealed character.
export function useDecode(text: string, delay = 0, speed = 40, afterBoot = false) {
    const [out, setOut] = useState(() => text.replace(/\S/g, " "));

    useEffect(() => {
        let raf = 0;
        let start = 0;
        let last = 0;
        const tick = (now: number) => {
            if (!start) {
                // Hold until the boot overlay has lifted (re-checked each frame so skipping it counts).
                if (afterBoot && getBootDelay() > 0) {
                    raf = requestAnimationFrame(tick);
                    return;
                }
                start = now + delay;
            }
            if (now >= start && now - last > 40) {
                last = now;
                const revealed = Math.floor((now - start) / speed);
                setOut(text.split("").map((c, i) => {
                    if (c === " " || i < revealed) return c;
                    if (i > revealed + 6) return " ";
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join(""));
                if (revealed >= text.length) return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [text, delay, speed, afterBoot]);

    return out;
}

const TICKER = [
    "CO-FOUNDER @ HEALTHPILOT.AI",
    "TEAM BUILT 0 → 15",
    "ITERATED UNTIL PMF",
    "2 LARGE HOSPITALS CLOSED",
    "HEAD OF PRODUCT & TECH",
    "AI-NATIVE HEALTHCARE"
];

// Home page header: decoded name, role line and a stat marquee.
export function FounderHero() {
    const name = useDecode("VIKRANTH JAGDISH", 200, 55, true);
    const role = useDecode("CO-FOUNDER · HEAD OF PRODUCT & TECH", 800, 32, true);

    return (
        <div className="mb-10 md:mb-14 select-none">
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
                className="h-px w-full bg-[var(--color-accent)]/40 origin-left mb-4"
            />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">[ 00 ] INDEX</p>
                    <p className="text-3xl md:text-5xl font-bold tracking-tighter text-white whitespace-pre">{name}</p>
                    <p className="text-xs md:text-sm text-[var(--color-accent)] mt-2 whitespace-pre">{role}</p>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                >
                    <Link
                        href="/founder"
                        onClick={() => playClickSound()}
                        className="group inline-flex items-center gap-3 border border-[var(--color-accent)]/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-colors"
                    >
                        <span className="relative flex w-2 h-2">
                            <span className="absolute inset-0 rounded-full bg-[var(--color-accent)] animate-ping opacity-60 group-hover:bg-black" />
                            <span className="relative w-2 h-2 rounded-full bg-[var(--color-accent)] group-hover:bg-black" />
                        </span>
                        Read the HealthPilot story
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </motion.div>
            </div>

            <div className="relative mt-6 overflow-hidden border-y border-white/10 py-2 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
                <div className="marquee-track flex w-max text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/60">
                    {[...TICKER, ...TICKER].map((item, i) => (
                        <span key={i} className="flex items-center gap-8 pr-8 whitespace-nowrap">
                            {item}
                            <span className="text-[var(--color-accent)]">✦</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
