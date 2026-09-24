"use client";

import React, { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, [role="button"], li.project-item, input, textarea, select, label';

// Crosshair cursor with a lagging reticle. Only on fine pointers; touch devices keep the default.
export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const coordsRef = useRef<HTMLSpanElement>(null);
    const [enabled, setEnabled] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [pressed, setPressed] = useState(false);

    useEffect(() => {
        const fine = window.matchMedia("(pointer: fine)").matches;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!fine || reduce) return;

        const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const ring = { ...target };
        let raf = 0;

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            if (!document.documentElement.classList.contains("has-custom-cursor")) {
                document.documentElement.classList.add("has-custom-cursor");
                ring.x = e.clientX;
                ring.y = e.clientY;
                setEnabled(true);
            }
            target.x = e.clientX;
            target.y = e.clientY;
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
            if (coordsRef.current) {
                coordsRef.current.textContent = `${String(e.clientX).padStart(4, "0")}·${String(e.clientY).padStart(4, "0")}`;
            }
            const el = e.target as Element | null;
            setHovering(!!el?.closest?.(INTERACTIVE));
        };
        const onDown = () => setPressed(true);
        const onUp = () => setPressed(false);

        const loop = () => {
            ring.x += (target.x - ring.x) * 0.18;
            ring.y += (target.y - ring.y) * 0.18;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            document.documentElement.classList.remove("has-custom-cursor");
        };
    }, []);

    if (!enabled) return null;

    const size = hovering ? 44 : 28;

    return (
        <div className="pointer-events-none fixed inset-0 z-[300] mix-blend-difference" aria-hidden="true">
            <div ref={dotRef} className="absolute left-0 top-0">
                <div className="w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent)]" />
            </div>
            <div ref={ringRef} className="absolute left-0 top-0">
                <div
                    className="relative transition-[width,height,transform] duration-200 ease-out"
                    style={{ width: size, height: size, transform: `translate(-50%, -50%) scale(${pressed ? 0.8 : 1}) rotate(${hovering ? 45 : 0}deg)` }}
                >
                    <span className="absolute left-0 top-0 w-2 h-2 border-l border-t border-[var(--color-accent)]" />
                    <span className="absolute right-0 top-0 w-2 h-2 border-r border-t border-[var(--color-accent)]" />
                    <span className="absolute left-0 bottom-0 w-2 h-2 border-l border-b border-[var(--color-accent)]" />
                    <span className="absolute right-0 bottom-0 w-2 h-2 border-r border-b border-[var(--color-accent)]" />
                </div>
                <span
                    ref={coordsRef}
                    className={`absolute left-5 top-4 text-[9px] font-mono text-[var(--color-accent)] tabular-nums whitespace-nowrap transition-opacity duration-200 ${hovering ? 'opacity-0' : 'opacity-60'}`}
                />
            </div>
        </div>
    );
}
