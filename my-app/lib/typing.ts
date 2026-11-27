// Typing stats from Monkeytype's public profile API.

type Best = { wpm: number; acc: number; language?: string; punctuation?: boolean };

export type TypingStats = {
    bests: { seconds: number; wpm: number; acc: number }[];
    tests: number;
    hours: number;
};

export async function getTypingStats(username: string): Promise<TypingStats | null> {
    try {
        const res = await fetch(`https://api.monkeytype.com/users/${encodeURIComponent(username)}/profile`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const { data } = await res.json();
        const time: Record<string, Best[]> = data?.personalBests?.time ?? {};
        const bests = Object.entries(time)
            .map(([seconds, runs]) => {
                const top = [...(runs ?? [])].sort((a, b) => b.wpm - a.wpm)[0];
                return top ? { seconds: Number(seconds), wpm: Math.round(top.wpm), acc: Math.round(top.acc) } : null;
            })
            .filter((b): b is { seconds: number; wpm: number; acc: number } => b !== null)
            .sort((a, b) => a.seconds - b.seconds);
        if (bests.length === 0) return null;
        return {
            bests,
            tests: data?.typingStats?.completedTests ?? 0,
            hours: Math.round((data?.typingStats?.timeTyping ?? 0) / 3600),
        };
    } catch {
        return null;
    }
}
