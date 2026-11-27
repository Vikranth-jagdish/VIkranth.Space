"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { VideoItem } from "@/lib/data";
import { sfx } from "@/lib/sound-utils";

/** A video in a phone-style frame. Shows a still until pressed, then plays in place. */
export function VideoTile({ video, className = "" }: { video: VideoItem; className?: string }) {
    const [playing, setPlaying] = useState(false);
    const ratio = video.wide ? "aspect-video" : "aspect-[9/16]";
    return (
        <figure className={`min-w-0 ${className}`}>
            <div className={`device ${ratio}`}>
                {playing ? (
                    video.youtube ? (
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&playsinline=1&rel=0`}
                            title={video.title}
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                            className="h-full w-full"
                        />
                    ) : (
                        <video src={encodeURI(video.src ?? "")} autoPlay controls playsInline className="h-full w-full object-cover" />
                    )
                ) : (
                    <button
                        type="button"
                        data-sfx-off
                        onClick={() => { sfx.open(); setPlaying(true); }}
                        onPointerEnter={() => sfx.tick()}
                        aria-label={`Play ${video.title}`}
                        className="group relative block h-full w-full"
                    >
                        {video.youtube ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={`https://i.ytimg.com/vi/${video.youtube}/oardefault.jpg`}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <video src={`${encodeURI(video.src ?? "")}#t=1`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                        )}
                        <span className="absolute inset-0 grid place-items-center bg-black/0 transition-colors group-hover:bg-black/20">
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[var(--ink)] shadow-md transition-transform group-hover:scale-110">
                                <Play size={15} fill="currentColor" className="translate-x-px" />
                            </span>
                        </span>
                    </button>
                )}
            </div>
            <figcaption className="mt-3 text-[13px] leading-snug">
                {video.title}
                <span className="block text-[var(--ink-soft)]">{video.note}</span>
            </figcaption>
        </figure>
    );
}
