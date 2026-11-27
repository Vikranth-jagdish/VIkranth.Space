"use client";

import useSWR from 'swr';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TopTracksList() {
    const { data, error, isLoading } = useSWR('/api/top-tracks', fetcher);

    if (isLoading) {
        return <div className="animate-pulse flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-white/[0.03] rounded-lg w-full"></div>)}
        </div>;
    }

    if (error || !data || !data.tracks || data.tracks.length === 0) {
        return <div className="bg-white/[0.03] border border-black/10 rounded-lg p-6 text-center text-neutral-500 italic">
            Could not load top tracks.
        </div>
    }

    return (
        <div className="flex flex-col gap-3">
            {data.tracks.map((track: any, index: number) => (
                <a
                    key={index}
                    href={track.songUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 bg-white hover:bg-neutral-100 border border-black/5 p-3 rounded-md transition-all duration-300"
                >
                    <div className="text-neutral-500 font-mono text-sm w-4 text-center">{index + 1}</div>

                    <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                        <Image src={track.albumImageUrl} alt={track.title} fill className="object-cover" />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-neutral-900 text-sm truncate group-hover:text-[#1ED760] transition-colors">{track.title}</span>
                        <span className="text-neutral-500 text-xs truncate">{track.artist}</span>
                    </div>

                    <ExternalLink size={14} className="text-neutral-500 group-hover:text-neutral-900 transition-colors opacity-0 group-hover:opacity-100" />
                </a>
            ))}
        </div>
    );
}
