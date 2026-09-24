"use client";

import React, { useId } from 'react';

// Builds a repeating heartbeat trace: flat baseline with a P-QRS-T complex every `period` px.
const buildPath = (width: number, height: number, period: number) => {
    const mid = height / 2;
    const amp = height * 0.42;
    let d = `M 0 ${mid}`;
    for (let x = 0; x < width; x += period) {
        const b = x + period * 0.35;
        d += ` L ${b} ${mid}`;
        d += ` Q ${b + 8} ${mid - amp * 0.18} ${b + 16} ${mid}`;
        d += ` L ${b + 24} ${mid}`;
        d += ` L ${b + 28} ${mid + amp * 0.2}`;
        d += ` L ${b + 34} ${mid - amp}`;
        d += ` L ${b + 40} ${mid + amp * 0.55}`;
        d += ` L ${b + 45} ${mid}`;
        d += ` L ${b + 58} ${mid}`;
        d += ` Q ${b + 70} ${mid - amp * 0.3} ${b + 82} ${mid}`;
    }
    d += ` L ${width} ${mid}`;
    return d;
};

interface EcgLineProps {
    className?: string;
    width?: number;
    height?: number;
    period?: number;
    duration?: number;
    color?: string;
}

// Monitor-style heartbeat: a bright pulse sweeps along a faint trace.
export function EcgLine({
    className = "",
    width = 1200,
    height = 80,
    period = 240,
    duration = 3.2,
    color = "var(--color-accent)"
}: EcgLineProps) {
    const id = useId().replace(/:/g, "");
    const d = buildPath(width, height, period);

    return (
        <svg
            className={className}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <filter id={`glow-${id}`} x="-10%" y="-50%" width="120%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path d={d} fill="none" stroke={color} strokeOpacity={0.12} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                pathLength={100}
                strokeDasharray="14 86"
                filter={`url(#glow-${id})`}
                className="ecg-pulse"
                style={{ animationDuration: `${duration}s` }}
            />
        </svg>
    );
}
