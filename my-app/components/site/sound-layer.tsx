"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, onMuteChange, setMuted, sfx } from "@/lib/sound-utils";

const INTERACTIVE = "a, button, [data-sfx]";

/** Site-wide hover and click sounds for every link and button. */
export function SoundLayer() {
    useEffect(() => {
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
        let last: Element | null = null;
        const over = (e: PointerEvent) => {
            if (!fine.matches) return;
            const el = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
            if (el && el !== last && !el.hasAttribute("data-sfx-off")) sfx.tick();
            last = el;
        };
        // A click is two sounds: the press on the way down and the release on the way up.
        const down = (e: PointerEvent) => {
            if (e.button !== 0) return;
            const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
            if (el && !el.hasAttribute("data-sfx-off")) sfx.press();
        };
        const click = (e: MouseEvent) => {
            const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
            if (el && !el.hasAttribute("data-sfx-off")) sfx.release();
        };
        // Scrolling a page gives a soft notch every so often, like a detented wheel.
        let lastY = window.scrollY;
        let travelled = 0;
        const scroll = () => {
            const dy = window.scrollY - lastY;
            lastY = window.scrollY;
            travelled += Math.abs(dy);
            if (travelled >= 140) { travelled = 0; sfx.detent(dy); }
        };
        document.addEventListener("pointerover", over, { passive: true });
        document.addEventListener("pointerdown", down, { capture: true, passive: true });
        document.addEventListener("click", click, { capture: true });
        window.addEventListener("scroll", scroll, { passive: true });
        return () => {
            document.removeEventListener("pointerover", over);
            document.removeEventListener("pointerdown", down, { capture: true });
            document.removeEventListener("click", click, { capture: true });
            window.removeEventListener("scroll", scroll);
        };
    }, []);
    return null;
}

export function SoundToggle({ className = "" }: { className?: string }) {
    const muted = useSyncExternalStore(onMuteChange, isMuted, () => false);
    return (
        <button
            type="button"
            data-sfx-off
            onClick={() => setMuted(!muted)}
            aria-pressed={!muted}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className={`inline-flex items-center gap-2 text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors ${className}`}
        >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{muted ? "Sound off" : "Sound on"}</span>
        </button>
    );
}
