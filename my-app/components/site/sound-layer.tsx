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
        const click = (e: MouseEvent) => {
            const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
            if (el && !el.hasAttribute("data-sfx-off")) sfx.tap();
        };
        document.addEventListener("pointerover", over, { passive: true });
        document.addEventListener("click", click, { capture: true });
        return () => {
            document.removeEventListener("pointerover", over);
            document.removeEventListener("click", click, { capture: true });
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
