"use client";

import useSWR from "swr";
import { parseTypingStats, typingUrl, type TypingStats } from "@/lib/typing";

/**
 * Typing numbers. The server passes what it could fetch; if that came back empty
 * (the API sometimes refuses server requests), the visitor's browser asks instead.
 */
export function TypingStatsCard({ username, initial }: { username: string; initial: TypingStats | null }) {
    const { data, isLoading } = useSWR(initial ? null : typingUrl(username), url => fetch(url).then(r => r.json()).then(parseTypingStats));
    const typing = initial ?? data ?? null;

    if (!typing) {
        return <p className="text-[var(--ink-soft)]">{isLoading ? "Loading typing stats…" : "Typing stats are not available right now."}</p>;
    }
    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                {typing.bests.map(b => (
                    <div key={b.seconds}>
                        <p className="text-5xl font-semibold tracking-[-0.04em] leading-none tabular-nums">{b.wpm}</p>
                        <p className="label mt-2">wpm · {b.seconds}s</p>
                        <p className="mt-1 text-sm text-[var(--ink-soft)] tabular-nums">{b.acc}% accuracy</p>
                    </div>
                ))}
            </div>
            <p className="mt-6 text-sm text-[var(--ink-soft)] tabular-nums">
                {typing.tests.toLocaleString("en-US")} tests completed, about {typing.hours} hours of typing.
            </p>
        </div>
    );
}
