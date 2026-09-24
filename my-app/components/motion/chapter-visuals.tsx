"use client";

import React, { useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const ease = [0.76, 0, 0.24, 1] as const;

// Shared frame: a monitor-like panel with corner ticks and a caption.
function Panel({ caption, children }: { caption: string; children: React.ReactNode }) {
    return (
        <div className="relative aspect-[4/3] w-full border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
            <span className="absolute left-2 top-2 w-3 h-3 border-l border-t border-[var(--color-accent)]" />
            <span className="absolute right-2 top-2 w-3 h-3 border-r border-t border-[var(--color-accent)]" />
            <span className="absolute left-2 bottom-2 w-3 h-3 border-l border-b border-[var(--color-accent)]" />
            <span className="absolute right-2 bottom-2 w-3 h-3 border-r border-b border-[var(--color-accent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative h-full w-full">{children}</div>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.3em] text-white/40 whitespace-nowrap">{caption}</p>
        </div>
    );
}

function useTyped(text: string, active: boolean, speed = 45) {
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => setN(v => (v >= text.length ? v : v + 1)), speed);
        return () => clearInterval(id);
    }, [active, text, speed]);
    return text.slice(0, n);
}

// 01: an empty terminal
function ZeroVisual({ active }: { active: boolean }) {
    const l1 = useTyped("mkdir healthpilot && cd healthpilot", active);
    const l2 = useTyped("git init", active && l1.length > 30, 60);
    return (
        <Panel caption="Day zero">
            <div className="p-6 md:p-8 font-mono text-[11px] md:text-xs text-white/80 space-y-2">
                <p><span className="text-[var(--color-accent)]">~ $</span> {l1}</p>
                {l1.length > 30 && <p><span className="text-[var(--color-accent)]">~/healthpilot $</span> {l2}</p>}
                {l2.length >= 8 && <p className="text-white/40">Initialized empty Git repository</p>}
                <p className="text-white/40">team: 1 · users: 0 · revenue: 0</p>
                <span className="inline-block w-2 h-4 bg-[var(--color-accent)] time-blink" />
            </div>
        </Panel>
    );
}

// 02: fifteen seats filling up one hire at a time
function TeamVisual({ active }: { active: boolean }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => setCount(c => (c >= 15 ? c : c + 1)), 140);
        return () => clearInterval(id);
    }, [active]);

    return (
        <Panel caption="Headcount">
            <div className="h-full flex flex-col items-center justify-center gap-6 pb-6">
                <div className="grid grid-cols-5 gap-3 md:gap-4">
                    {Array.from({ length: 15 }).map((_, i) => {
                        const on = i < count;
                        return (
                            <motion.div
                                key={i}
                                animate={{ scale: on ? 1 : 0.6, opacity: on ? 1 : 0.25 }}
                                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                className={`w-8 h-8 md:w-10 md:h-10 border flex items-center justify-center text-[9px] font-bold ${on ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-black' : 'border-white/20 text-white/30'}`}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </motion.div>
                        );
                    })}
                </div>
                <p className="text-4xl md:text-5xl font-bold tabular-nums text-white">
                    {String(count).padStart(2, "0")}<span className="text-white/30 text-lg md:text-xl"> / 15</span>
                </p>
            </div>
        </Panel>
    );
}

// 03: the build / ship / learn loop spinning around a rebuild counter
function IterateVisual({ active }: { active: boolean }) {
    const reduce = useReducedMotion();
    const steps = ["BUILD", "SHIP", "LEARN", "REBUILD"];
    const [step, setStep] = useState(0);
    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => setStep(s => (s + 1) % steps.length), 900);
        return () => clearInterval(id);
    }, [active, steps.length]);

    return (
        <Panel caption="Iteration loop">
            <div className="h-full flex items-center justify-center pb-6">
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                    <motion.svg
                        viewBox="0 0 200 200"
                        className="absolute inset-0"
                        animate={reduce ? undefined : { rotate: 360 }}
                        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    >
                        <circle cx="100" cy="100" r="92" fill="none" stroke="white" strokeOpacity="0.12" strokeDasharray="2 6" />
                        <circle cx="100" cy="100" r="70" fill="none" stroke="var(--color-accent)" strokeOpacity="0.5" strokeDasharray="60 380" strokeWidth="2" />
                    </motion.svg>
                    <motion.svg
                        viewBox="0 0 200 200"
                        className="absolute inset-0"
                        animate={reduce ? undefined : { rotate: -360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    >
                        <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeOpacity="0.2" strokeDasharray="30 20" />
                    </motion.svg>
                    {steps.map((s, i) => {
                        const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
                        const x = 50 + Math.cos(angle) * 46;
                        const y = 50 + Math.sin(angle) * 46;
                        const on = i === step;
                        return (
                            <span
                                key={s}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 text-[9px] tracking-[0.2em] px-1.5 py-0.5 transition-colors duration-300 ${on ? 'bg-[var(--color-accent)] text-black font-bold' : 'bg-black text-white/50'}`}
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                                {s}
                            </span>
                        );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                            key={step}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[var(--color-accent)] text-xl">
                            ↻
                        </motion.span>
                    </div>
                </div>
            </div>
        </Panel>
    );
}

// 04: the retention curve that stops falling and flattens out
function PmfVisual({ active }: { active: boolean }) {
    const early = "M 20 30 C 60 110, 90 150, 140 170 S 240 185, 280 190";
    const later = "M 20 30 C 50 80, 80 100, 130 108 S 230 112, 280 110";
    return (
        <Panel caption="Retention, illustrative">
            <svg viewBox="0 0 300 220" className="absolute inset-0 w-full h-full p-6 pb-10">
                <line x1="20" y1="200" x2="290" y2="200" stroke="white" strokeOpacity="0.2" />
                <line x1="20" y1="20" x2="20" y2="200" stroke="white" strokeOpacity="0.2" />
                <motion.path
                    d={early}
                    fill="none"
                    stroke="white"
                    strokeOpacity="0.3"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: active ? 1 : 0 }}
                    transition={{ duration: 1.2, ease }}
                />
                <motion.path
                    d={later}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: active ? 1 : 0 }}
                    transition={{ duration: 1.6, ease, delay: 0.6 }}
                />
                <motion.g
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
                    transition={{ delay: 2, duration: 0.4 }}
                    style={{ transformOrigin: "230px 111px" }}
                >
                    <circle cx="230" cy="111" r="5" fill="var(--color-accent)" />
                    <circle cx="230" cy="111" r="12" fill="none" stroke="var(--color-accent)" strokeOpacity="0.5" className="animate-ping" style={{ transformOrigin: "230px 111px" }} />
                    <text x="230" y="92" textAnchor="middle" fill="var(--color-accent)" fontSize="11" fontWeight="bold" fontFamily="Space Mono, monospace">PMF</text>
                </motion.g>
                <text x="240" y="182" fill="white" fillOpacity="0.35" fontSize="8" fontFamily="Space Mono, monospace">early</text>
                <text x="24" y="214" fill="white" fillOpacity="0.35" fontSize="8" fontFamily="Space Mono, monospace">time →</text>
            </svg>
        </Panel>
    );
}

function Hospital({ x, delay, active }: { x: number; delay: number; active: boolean }) {
    return (
        <motion.g
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
            transition={{ delay, duration: 0.6, ease }}
        >
            <rect x={x} y="60" width="70" height="90" fill="black" stroke="var(--color-accent)" strokeWidth="1.5" />
            <rect x={x + 28} y="68" width="14" height="4" fill="var(--color-accent)" />
            <rect x={x + 33} y="63" width="4" height="14" fill="var(--color-accent)" />
            {Array.from({ length: 9 }).map((_, i) => (
                <motion.rect
                    key={i}
                    x={x + 10 + (i % 3) * 18}
                    y={88 + Math.floor(i / 3) * 18}
                    width="12"
                    height="10"
                    fill="var(--color-accent)"
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: active ? [0.1, 0.9, 0.5] : 0.1 }}
                    transition={{ delay: delay + 0.5 + i * 0.08, duration: 0.6 }}
                />
            ))}
        </motion.g>
    );
}

// 05: two hospitals wired into the platform
function ScaleVisual({ active }: { active: boolean }) {
    return (
        <Panel caption="Hospitals live">
            <svg viewBox="0 0 300 220" className="absolute inset-0 w-full h-full p-4 pb-10">
                <Hospital x={20} delay={0.1} active={active} />
                <Hospital x={210} delay={0.4} active={active} />
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <circle cx="150" cy="105" r="18" fill="black" stroke="white" strokeOpacity="0.5" />
                    <text x="150" y="109" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Space Mono, monospace">HP</text>
                </motion.g>
                {[
                    "M 90 105 L 105 105 L 110 95 L 116 118 L 122 100 L 132 105",
                    "M 168 105 L 178 105 L 183 95 L 189 118 L 195 100 L 210 105"
                ].map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: active ? 1 : 0 }}
                        transition={{ delay: 1 + i * 0.3, duration: 0.8, ease }}
                    />
                ))}
                <motion.text
                    x="150" y="185"
                    textAnchor="middle"
                    fill="var(--color-accent)"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="Space Mono, monospace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{ delay: 1.8 }}
                >
                    2 / 2 CONNECTED
                </motion.text>
            </svg>
        </Panel>
    );
}

const VISUALS: Record<string, React.ComponentType<{ active: boolean }>> = {
    zero: ZeroVisual,
    team: TeamVisual,
    iterate: IterateVisual,
    pmf: PmfVisual,
    scale: ScaleVisual
};

export function ChapterVisual({ id }: { id: string }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.5, once: true });
    const Visual = VISUALS[id];
    if (!Visual) return null;
    return (
        <div ref={ref}>
            <Visual active={inView} />
        </div>
    );
}
