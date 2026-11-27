// Typing stats from Monkeytype's public profile API.

type Best = { wpm: number; acc: number };

export type TypingStats = {
    bests: { seconds: number; wpm: number; acc: number }[];
    tests: number;
    hours: number;
};

export const typingUrl = (username: string) => `https://api.monkeytype.com/users/${encodeURIComponent(username)}/profile`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseTypingStats(payload: any): TypingStats | null {
    const data = payload?.data;
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
}

export async function getTypingStats(username: string): Promise<TypingStats | null> {
    try {
        const res = await fetch(typingUrl(username), { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return parseTypingStats(await res.json());
    } catch {
        return null;
    }
}
