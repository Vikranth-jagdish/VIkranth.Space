"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EcgLine } from './ecg-line';

const BOOT_LINES = [
    "> INIT VIKRANTH.SPACE",
    "> LOADING CO-FOUNDER.PROFILE",
    "> TEAM ............ 0 → 15",
    "> PRODUCT ......... ITERATE UNTIL PMF",
    "> HOSPITALS ....... 2 CLOSED",
    "> STATUS .......... ONLINE"
];

const STORAGE_KEY = "vs-booted";
const BOOT_MS = 2200;
const EXIT_MS = 1150;

let bootShownAt: number | null = null;

// How long intro animations elsewhere should wait so they play after the overlay lifts.
export function getBootDelay() {
    if (typeof window === "undefined") return 0;
    if (bootShownAt !== null) return Math.max(0, BOOT_MS + EXIT_MS - (performance.now() - bootShownAt));
    try {
        if (sessionStorage.getItem(STORAGE_KEY) === "1") return 0;
    } catch {
        return 0;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
    return BOOT_MS + EXIT_MS;
}

// Terminal boot overlay, shown once per browser session. Click anywhere to skip.
export function BootSequence() {
    const reduceMotion = useReducedMotion();
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [lineCount, setLineCount] = useState(0);

    useEffect(() => {
        let seen = false;
        try {
            seen = sessionStorage.getItem(STORAGE_KEY) === "1";
            sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
            // storage unavailable, just show it
        }
        if (seen || reduceMotion) return;
        bootShownAt = performance.now();

        let start = 0;
        const total = BOOT_MS;
        let raf = 0;
        const tick = (now: number) => {
            if (!start) {
                start = now;
                setVisible(true);
            }
            const t = Math.min(1, (now - start) / total);
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(Math.round(eased * 100));
            setLineCount(Math.min(BOOT_LINES.length, Math.floor(t * (BOOT_LINES.length + 1))));
            if (t < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setTimeout(() => setVisible(false), 350);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [reduceMotion]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="boot"
                    className="fixed inset-0 z-[200] bg-[#050505] text-[var(--color-accent)] font-mono flex flex-col justify-between p-4 md:p-8 cursor-pointer"
                    onClick={() => {
                        bootShownAt = performance.now() - BOOT_MS;
                        setVisible(false);
                    }}
                    initial={{ clipPath: "inset(0 0 0% 0)" }}
                    exit={{ clipPath: "inset(0 0 100% 0)" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] opacity-60">
                        <span>VIKRANTH JAGDISH</span>
                        <span>[ CLICK TO SKIP ]</span>
                    </div>

                    <div className="space-y-1 text-xs md:text-sm">
                        {BOOT_LINES.slice(0, lineCount).map((line, i) => (
                            <motion.p
                                key={line}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: i === lineCount - 1 ? 1 : 0.5, x: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {line}
                            </motion.p>
                        ))}
                        <span className="inline-block w-2 h-4 bg-[var(--color-accent)] time-blink align-middle" />
                    </div>

                    <div>
                        <EcgLine className="w-full h-16 mb-6" duration={1.6} />
                        <div className="flex items-end justify-between">
                            <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">Co-founder · Product · Tech</span>
                            <span className="text-6xl md:text-8xl font-bold tabular-nums leading-none">
                                {String(progress).padStart(3, "0")}
                            </span>
                        </div>
                        <div className="h-px w-full bg-white/10 mt-4 overflow-hidden">
                            <div className="h-full bg-[var(--color-accent)]" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
