"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import useSWR from "swr";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EdgeBend } from "@/components/site/edge-bend";
import { SoundToggle } from "@/components/site/sound-layer";
import { VideoTile } from "@/components/site/video-tile";
import { BLOGS, EXPERIENCE, LABS, PROFILE, PROJECTS, SOCIAL_LINKS, VIDEOS } from "@/lib/data";
import { sfx } from "@/lib/sound-utils";

type Photo = { id: number; src: string; alt: string; link: string };

const fetcher = (url: string) => fetch(url).then(r => r.json());

const SECTIONS = [
    { id: "intro", label: "Intro" },
    { id: "career", label: "Career" },
    { id: "work", label: "Work" },
    { id: "videos", label: "Videos" },
    { id: "music", label: "Music" },
    { id: "stats", label: "Stats" },
    { id: "photos", label: "Photos" },
    { id: "writing", label: "Writing" },
    { id: "contact", label: "Contact" }
];

function useChennaiTime() {
    const [time, setTime] = useState<string | null>(null);
    useEffect(() => {
        const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: PROFILE.timeZone });
        const update = () => setTime(fmt.format(new Date()));
        update();
        const id = setInterval(update, 20_000);
        return () => clearInterval(id);
    }, []);
    return time;
}

function More({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="group inline-flex items-center gap-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">
            {children}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
    );
}

function Panel({ id, className = "", children }: { id: string; className?: string; children: React.ReactNode }) {
    return (
        <section id={id} {...(SECTIONS.some(s => s.id === id) ? { "data-section": "" } : {})} className={`panel ${className}`}>
            {children}
        </section>
    );
}

/* ---------- Career objects ---------- */

function Thing({ children, className, rotate, bounds, drag }: { children: React.ReactNode; className: string; rotate: number; bounds: React.RefObject<HTMLDivElement | null>; drag: boolean }) {
    return (
        <motion.div
            drag={drag}
            dragConstraints={bounds}
            dragElastic={0.15}
            dragMomentum={false}
            initial={{ rotate }}
            whileHover={drag ? { scale: 1.03 } : undefined}
            whileDrag={{ scale: 1.07, rotate: 0, zIndex: 20 }}
            onDragStart={() => sfx.pick()}
            onDragEnd={() => sfx.drop()}
            data-sfx
            className={`rail:absolute select-none ${drag ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
        >
            {children}
        </motion.div>
    );
}

const FINE_POINTER = "(pointer: fine)";
function subscribeFinePointer(fn: () => void) {
    const mq = window.matchMedia(FINE_POINTER);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
}

const shadow = "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_12px_26px_rgba(0,0,0,0.12)]";

// A die-cut sticker. Shows the image at public/desk/cutout.png when there is one,
// otherwise an original pixel dragon. Each letter below is a colour, dots are empty.
const DRAGON = [
    "................",
    "......rrr.......",
    ".....rrrrr..ww..",
    "....rrerrr.www..",
    "....rrrrrrwwww..",
    ".....ryyrrrww...",
    "...rrryyyrr.....",
    "..rrrryyyrrr....",
    "..rr.rrrrrr.r...",
    ".....rr..rr.rr..",
    "....rrr..rrr.of.",
    "..............f."
];
const DRAGON_COLORS: Record<string, string> = { r: "#e2533a", e: "#17181a", y: "#ffd76a", w: "#a8321f", o: "#ff9a3c", f: "#ffcf4a" };

function Cutout({ image }: { image: boolean }) {
    return (
        <div className="sticker">
            {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/desk/cutout.png" alt="" draggable={false} className="w-full" />
            ) : (
                <svg viewBox="0 0 16 12" className="w-full" shapeRendering="crispEdges" aria-hidden="true">
                    {DRAGON.flatMap((row, y) => row.split("").map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={DRAGON_COLORS[c]} />)))}
                </svg>
            )}
        </div>
    );
}

function TinyComputer() {
    return (
        <div>
            <div className={`rounded-[14px] bg-[#e7e2d3] p-3 ${shadow}`}>
                <div className="rounded-lg bg-[#10231a] p-3 font-mono text-[11px] leading-relaxed text-[#7dffa8] shadow-[inset_0_0_18px_rgba(0,0,0,0.6)]">
                    <p>&gt; whoami</p>
                    <p className="text-[#c9ffd9]">builds things</p>
                    <p>&gt; status</p>
                    <p className="text-[#c9ffd9]">shipping</p>
                    <p>&gt; <span className="cursor-blink">▍</span></p>
                </div>
                <div className="mt-2.5 flex items-center justify-between px-1">
                    <span className="h-1.5 w-10 rounded-full bg-[#c9c3b1]" />
                    <span className="h-2 w-2 rounded-full bg-[#2fb463]" />
                </div>
            </div>
            <div className="mx-auto h-2 w-[46%] bg-[#d6d0be]" />
            <div className="mx-auto h-1.5 w-[70%] rounded-b-md bg-[#c9c3b1]" />
        </div>
    );
}

// One octave and a bit. Semitones above middle C for each white key, and where the black keys sit.
const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11, 12];
const BLACK_KEYS = [{ semitone: 1, after: 0 }, { semitone: 3, after: 1 }, { semitone: 6, after: 3 }, { semitone: 8, after: 4 }, { semitone: 10, after: 5 }];

/** A tiny keyboard that actually plays. */
function MiniKeys() {
    return (
        <div className={`rounded-xl bg-[#1b1c1f] p-2.5 pt-4 ${shadow}`}>
            <div className="mb-2 flex items-center justify-between px-1">
                <span className="h-1 w-8 rounded-full bg-[#b4202b]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/50">play me</span>
            </div>
            <div className="relative flex h-[92px] gap-px overflow-hidden rounded-b-md">
                {WHITE_KEYS.map(n => (
                    <button
                        key={n}
                        type="button"
                        data-sfx-off
                        aria-label="Piano key"
                        onPointerDown={e => { e.stopPropagation(); sfx.key(n); }}
                        className="h-full flex-1 rounded-b-[4px] bg-[#fbfaf5] transition-transform active:translate-y-0.5 active:bg-[#e9e7dd]"
                    />
                ))}
                {BLACK_KEYS.map(k => (
                    <button
                        key={k.semitone}
                        type="button"
                        data-sfx-off
                        aria-label="Piano key"
                        onPointerDown={e => { e.stopPropagation(); sfx.key(k.semitone); }}
                        style={{ left: `calc(${((k.after + 1) / WHITE_KEYS.length) * 100}% - 7%)` }}
                        className="absolute top-0 h-[58%] w-[14%] max-w-[26px] rounded-b-[3px] bg-[#17181a] transition-transform active:translate-y-0.5 active:bg-[#34363b]"
                    />
                ))}
            </div>
        </div>
    );
}

function CareerObjects({ cutout }: { cutout: boolean }) {
    const bounds = useRef<HTMLDivElement>(null);
    const drag = useSyncExternalStore(subscribeFinePointer, () => window.matchMedia(FINE_POINTER).matches, () => false);
    const hp = EXPERIENCE.find(e => e.id === "healthpilot")!;
    const dao = EXPERIENCE.find(e => e.id === "dao")!;
    const vnest = EXPERIENCE.find(e => e.id === "vnest")!;
    return (
        <div ref={bounds} className="relative grid grid-cols-2 items-center gap-6 rail:block rail:h-full">
            <Thing bounds={bounds} drag={drag} rotate={-3} className="rail:left-[1%] rail:top-[2%] rail:w-[215px]">
                <div className={`overflow-hidden rounded-xl bg-white ${shadow}`}>
                    <div className="flex h-11 items-center justify-center bg-[var(--blue)]"><span className="h-2 w-12 rounded-full bg-white/40" /></div>
                    <div className="p-4">
                        <p className="text-lg font-semibold tracking-tight">{hp.company}</p>
                        <p className="text-sm text-[var(--ink-soft)]">{hp.title}</p>
                        <p className="label mt-3">{hp.years}</p>
                    </div>
                </div>
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={6} className="rail:left-[34%] rail:top-[2%] rail:w-[190px]">
                <Cutout image={cutout} />
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={-2} className="rail:right-[1%] rail:top-[4%] rail:w-[205px]">
                <TinyComputer />
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={2} className="col-span-2 rail:bottom-[2%] rail:left-[2%] rail:w-[270px]">
                <MiniKeys />
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={-5} className="rail:bottom-[-2%] rail:left-[53%] rail:w-[132px]">
                <div className={`flex aspect-square flex-col justify-between bg-[var(--marker)] p-3.5 ${shadow}`}>
                    <span className="hand !text-[24px]">{vnest.company}</span>
                    <span className="hand !text-[17px]">{vnest.title.toLowerCase()}, startup incubator</span>
                </div>
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={7} className="rail:bottom-[3%] rail:right-[3%] rail:w-[142px]">
                <div className={`grid aspect-square place-items-center rounded-full border-[3px] border-double border-[var(--ink)] bg-white p-4 text-center ${shadow}`}>
                    <div>
                        <p className="label !text-[var(--ink)]">{dao.title}</p>
                        <p className="mt-1 text-sm font-semibold leading-tight">DAO Community</p>
                        <p className="label mt-1">{dao.years}</p>
                    </div>
                </div>
            </Thing>
        </div>
    );
}

/* ---------- Live panels ---------- */

function MusicPanel() {
    const { data } = useSWR("/api/now-playing", fetcher, { refreshInterval: 30_000 });
    const playing = Boolean(data?.isPlaying);
    const hasTrack = Boolean(data?.title);
    return (
        <div className="flex h-full flex-col justify-between gap-8">
            <div className="flex items-center justify-between">
                <p className="label">{playing ? "Now playing" : "Music"}</p>
                {playing && <span className="h-2 w-2 rounded-full bg-[#2fb463]" />}
            </div>
            <div className={`record relative mx-auto aspect-square w-[70%] max-w-[260px] ${playing ? "spinning" : ""}`}>
                <div className="absolute inset-[31%] overflow-hidden rounded-full bg-[var(--marker)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {data?.albumImageUrl && <img src={data.albumImageUrl} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="absolute inset-[48.5%] rounded-full bg-[var(--sheet)]" />
            </div>
            <div className="min-w-0">
                {hasTrack ? (
                    <a href={data.songUrl} target="_blank" rel="noreferrer" className="block">
                        <p className="truncate font-medium">{data.title}</p>
                        <p className="truncate text-sm text-[var(--ink-soft)]">{data.artist}</p>
                    </a>
                ) : (
                    <>
                        <p className="font-medium">Nothing on right now</p>
                        <p className="text-sm text-[var(--ink-soft)]">The record spins when Spotify is playing.</p>
                    </>
                )}
                <div className="mt-4"><More href="/stats">Top tracks</More></div>
            </div>
        </div>
    );
}

function StatsPanel() {
    const { data } = useSWR("/api/github-stats", fetcher);
    const calendar = data?.contributionsCollection?.contributionCalendar;
    const weeks: { contributionDays: { contributionCount: number; date: string }[] }[] = calendar?.weeks?.slice(-18) ?? [];
    const shade = (n: number) => (n === 0 ? "bg-[#ededeb]" : n < 3 ? "bg-[#c5d2f6]" : n < 7 ? "bg-[#7f9cec]" : "bg-[var(--blue)]");
    return (
        <div className="flex h-full flex-col justify-between gap-8">
            <p className="label">Stats</p>
            <div>
                {calendar ? (
                    <>
                        <p className="text-7xl font-semibold tracking-[-0.05em] leading-none tabular-nums rail:text-8xl">
                            {calendar.totalContributions.toLocaleString("en-US")}
                        </p>
                        <p className="mt-3 text-sm text-[var(--ink-soft)]">GitHub contributions in the last year</p>
                    </>
                ) : (
                    <p className="max-w-[22ch] text-2xl font-semibold tracking-[-0.03em] leading-tight">Code, typing speed and what I listen to.</p>
                )}
            </div>
            <div className="grid grid-flow-col grid-rows-7 justify-start gap-[3px]" aria-hidden="true">
                {(weeks.length ? weeks : Array.from({ length: 18 }, () => ({ contributionDays: Array.from({ length: 7 }, () => ({ contributionCount: 0, date: "" })) }))).flatMap((w, i) =>
                    w.contributionDays.map((d, j) => <span key={`${i}-${j}`} className={`h-3 w-3 ${shade(d.contributionCount)}`} />)
                )}
            </div>
            <More href="/stats">All stats</More>
        </div>
    );
}

/* ---------- The rail ---------- */

export default function Rail({ photos, cutout = false }: { photos: Photo[]; cutout?: boolean }) {
    const railRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const activeRef = useRef(0);
    const stopEase = useRef<() => void>(() => { });
    const reduce = useReducedMotion();
    const time = useChennaiTime();

    const panels = useCallback(() => Array.from(railRef.current?.querySelectorAll<HTMLElement>("[data-section]") ?? []), []);

    const goTo = useCallback((index: number) => {
        const list = panels();
        const el = list[Math.max(0, Math.min(list.length - 1, index))];
        const rail = railRef.current;
        if (!el || !rail) return;
        stopEase.current();
        if (Math.abs(index - activeRef.current) > 1) sfx.slide();
        const box = el.getBoundingClientRect();
        const left = rail.scrollLeft + box.left + box.width / 2 - rail.clientWidth / 2;
        rail.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
    }, [panels, reduce]);

    // Vertical wheel movement drives the rail sideways, eased towards a target.
    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return;
        let target = rail.scrollLeft;
        let raf = 0;
        let easing = false;

        const step = () => {
            const diff = target - rail.scrollLeft;
            if (!easing || Math.abs(diff) < 1) { rail.scrollLeft = easing ? target : rail.scrollLeft; easing = false; return; }
            // Scroll positions are whole pixels, so always move at least one.
            const move = diff * 0.16;
            rail.scrollLeft += Math.abs(move) < 1 ? Math.sign(diff) : move;
            raf = requestAnimationFrame(step);
        };
        stopEase.current = () => { easing = false; cancelAnimationFrame(raf); };

        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey) return;
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
            e.preventDefault();
            if (!easing) target = rail.scrollLeft;
            const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
            target = Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth, target + delta));
            if (reduce) { rail.scrollLeft = target; return; }
            if (!easing) { easing = true; raf = requestAnimationFrame(step); }
        };

        let lastLeft = rail.scrollLeft;
        let travelled = 0;
        const measure = () => {
            // A soft notch for every stretch of sideways travel.
            const dx = rail.scrollLeft - lastLeft;
            lastLeft = rail.scrollLeft;
            travelled += Math.abs(dx);
            if (travelled >= 700) { travelled = 0; sfx.detent(); }

            const list = panels();
            const mid = window.innerWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            list.forEach((el, i) => {
                const r = el.getBoundingClientRect();
                const start = r.left;
                const end = r.right;
                const dist = mid < start ? start - mid : mid > end ? mid - end : 0;
                if (dist < bestDist) { bestDist = dist; best = i; }
            });
            if (best !== activeRef.current) {
                activeRef.current = best;
                setActive(best);
                sfx.note(best);
            }
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLElement && /input|textarea|select/i.test(e.target.tagName)) return;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(activeRef.current + 1); }
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goTo(activeRef.current - 1); }
        };

        rail.addEventListener("wheel", onWheel, { passive: false });
        rail.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure);
        window.addEventListener("keydown", onKey);
        measure();
        return () => {
            cancelAnimationFrame(raf);
            rail.removeEventListener("wheel", onWheel);
            rail.removeEventListener("scroll", measure);
            window.removeEventListener("scroll", measure);
            window.removeEventListener("resize", measure);
            window.removeEventListener("keydown", onKey);
        };
    }, [goTo, panels, reduce]);

    // Scale the panels down as a whole on short or narrow screens, so a phone held
    // sideways shows the same layout as a desktop.
    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return;
        const fit = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const zoom = Math.min(1, (0.72 * vh) / 560, vw < 768 ? Math.max(0.5, (vw - 32) / 600) : 1);
            if (zoom < 0.999) {
                rail.style.setProperty("--rail-zoom", zoom.toFixed(3));
                rail.setAttribute("data-compact", "");
            } else {
                rail.style.removeProperty("--rail-zoom");
                rail.removeAttribute("data-compact");
            }
        };
        fit();
        window.addEventListener("resize", fit);
        return () => window.removeEventListener("resize", fit);
    }, []);

    const [upright, setUpright] = useState(false);

    const homeVideos = VIDEOS.filter(v => !v.wide).slice(0, 4);
    const edit = VIDEOS.find(v => v.wide);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 bg-[var(--wall)]/85 px-4 py-4 backdrop-blur rail:bg-transparent rail:px-8 rail:backdrop-blur-none">
                <span className="text-sm font-medium">{PROFILE.name}</span>
                <nav aria-label="Sections" className="hidden items-center gap-1.5 rail:flex">
                    {SECTIONS.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            data-sfx-off
                            onPointerDown={() => sfx.press()}
                            onClick={() => goTo(i)}
                            onPointerEnter={() => sfx.tick()}
                            aria-label={s.label}
                            aria-current={active === i}
                            className="group relative flex h-6 items-center"
                        >
                            <span className={`block h-3.5 transition-all duration-300 ${active === i ? "w-6 border border-[var(--ink)]" : "w-px bg-[#a9aaad] group-hover:bg-[var(--ink)]"}`} />
                            <span className="pointer-events-none absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap text-[11px] text-[var(--ink-soft)] opacity-0 transition-opacity group-hover:opacity-100">{s.label}</span>
                        </button>
                    ))}
                    <span className="label ml-3 w-16">{SECTIONS[active].label}</span>
                </nav>
                <SoundToggle />
            </header>

            <EdgeBend />

            {!upright && (
                <div className="rotate-hint fixed inset-0 z-50 flex-col items-center justify-center gap-6 bg-[var(--wall)] px-8 text-center">
                    <span className="phone block h-16 w-9 rounded-lg border-2 border-[var(--ink)]" />
                    <div>
                        <p className="text-xl font-semibold tracking-tight">Turn your phone sideways</p>
                        <p className="mt-2 text-sm text-[var(--ink-soft)]">This site scrolls left to right and reads best in landscape.</p>
                    </div>
                    <button type="button" onClick={() => setUpright(true)} className="link text-sm">Stay upright</button>
                </div>
            )}

            <div ref={railRef} className="rail">
                {/* Intro */}
                <Panel id="intro" className="rail:w-[600px]">
                    <div className="flex h-full flex-col justify-between gap-10">
                        <div>
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <h1 className="font-medium">{PROFILE.name}</h1>
                                    <p className="text-[var(--ink-soft)]">{PROFILE.role}</p>
                                </div>
                                <span className="hand grid h-16 w-16 flex-none place-items-center bg-[var(--marker)] !text-[30px]">vj</span>
                            </div>
                            <p className="label mb-3 mt-10">Today</p>
                            <div className="max-w-[40ch] space-y-3 leading-relaxed text-[#45474c]">
                                {PROFILE.intro.map(p => <p key={p}>{p}</p>)}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <button type="button" onClick={() => goTo(1)} className="group inline-flex items-center gap-1.5 text-sm">
                                <span className="link">Selected work and career</span>
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <span className="label hidden rail:block">Scroll, or use arrow keys</span>
                        </div>
                    </div>
                </Panel>

                {/* Career */}
                <Panel id="career" className="rail:w-[820px]">
                    <div className="flex h-full flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <p className="label">On my desk</p>
                            <More href="/experience">Full experience</More>
                        </div>
                        <div className="min-h-0 flex-1"><CareerObjects cutout={cutout} /></div>
                        <p className="label hidden rail:block">Everything here can be dragged</p>
                    </div>
                </Panel>

                {/* Work */}
                <Panel id="work-title" className="rail:w-[420px] rail:!px-0">
                    <div className="grid h-full place-items-center"><p className="panel-word">Work</p></div>
                </Panel>
                <Panel id="work" className="rail:w-[560px]">
                    <div className="flex h-full flex-col justify-between gap-8">
                        <div>
                            <p className="label mb-4">Selected projects</p>
                            <ul className="row-list">
                                {PROJECTS.map(p => (
                                    <li key={p.id}>
                                        <Link href="/projects" className="group flex items-baseline justify-between gap-4 py-3">
                                            <span className="min-w-0">
                                                <span className="font-medium">{p.title}</span>
                                                <span className="block truncate text-sm text-[var(--ink-soft)]">{p.kind}</span>
                                            </span>
                                            <span className="label tabular-nums transition-colors group-hover:!text-[var(--ink)]">{p.year}</span>
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link href={LABS[0].link} className="group flex items-baseline justify-between gap-4 py-3">
                                        <span className="min-w-0">
                                            <span className="font-medium">{LABS[0].title}</span>
                                            <span className="block truncate text-sm text-[var(--ink-soft)]">{LABS[0].kind}</span>
                                        </span>
                                        <span className="label tabular-nums transition-colors group-hover:!text-[var(--ink)]">{LABS[0].year}</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <More href="/founder">Founder story</More>
                            <More href="/projects">Projects</More>
                            <More href="/labs">Labs</More>
                        </div>
                    </div>
                </Panel>

                {/* Videos */}
                <Panel id="videos-title" className="rail:w-[420px] rail:!px-0">
                    <div className="grid h-full place-items-center"><p className="panel-word">Off hours</p></div>
                </Panel>
                <Panel id="videos" className="rail:w-[1120px]">
                    <div className="flex h-full flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <p className="label">Piano and video edits</p>
                            <More href="/videos">All videos</More>
                        </div>
                        <div className="grid min-h-0 flex-1 grid-cols-2 items-start gap-5 rail:grid-cols-[repeat(4,172px)_minmax(0,1fr)] rail:content-center rail:items-center rail:gap-6">
                            {homeVideos.map(v => <VideoTile key={v.id} video={v} />)}
                            {edit && <VideoTile video={edit} className="col-span-2 rail:col-span-1" />}
                        </div>
                    </div>
                </Panel>

                {/* Music */}
                <Panel id="music" className="rail:w-[380px]">
                    <MusicPanel />
                </Panel>

                {/* Stats */}
                <Panel id="stats" className="rail:w-[460px]">
                    <StatsPanel />
                </Panel>

                {/* Photos */}
                <Panel id="photos" className="rail:w-[1180px]">
                    <div className="flex h-full flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <p className="label">Photos</p>
                            <More href="/photos">Gallery</More>
                        </div>
                        {photos.length > 0 ? (
                            <div className="flex min-h-0 flex-1 flex-wrap content-center justify-center gap-x-5 gap-y-4">
                                {photos.slice(0, 9).map((p, i) => (
                                    <div
                                        key={p.id}
                                        className={`w-[196px] flex-none bg-white p-2 pb-6 ${shadow}`}
                                        style={{ transform: `rotate(${[-4, 2, 5, -2, 3, 4, -3, 2, -5][i]}deg)` }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.src} alt={p.alt} loading="lazy" className="aspect-square w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid flex-1 place-items-center">
                                <p className="max-w-[24ch] text-center text-[var(--ink-soft)]">Things I notice on walks, mostly around Chennai.</p>
                            </div>
                        )}
                    </div>
                </Panel>

                {/* Writing */}
                <Panel id="writing-title" className="rail:w-[420px] rail:!px-0">
                    <div className="grid h-full place-items-center"><p className="panel-word">Notes</p></div>
                </Panel>
                <Panel id="writing" className="rail:w-[560px]">
                    <div className="flex h-full flex-col justify-between gap-8">
                        <div>
                            <p className="label mb-4">Writing</p>
                            <ul className="row-list">
                                {BLOGS.map(b => (
                                    <li key={b.slug}>
                                        <Link href={`/blogs/${b.slug}`} className="group flex items-baseline justify-between gap-4 py-3">
                                            <span className="min-w-0 font-medium leading-snug">{b.title}</span>
                                            <span className="label flex-none tabular-nums transition-colors group-hover:!text-[var(--ink)]">{b.date.slice(0, 4)}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <More href="/blogs">All posts</More>
                    </div>
                </Panel>

                {/* Contact */}
                <Panel id="contact" className="rail:w-[520px]">
                    <div className="flex h-full flex-col justify-between gap-10">
                        <p className="label">Contact</p>
                        <div>
                            <p className="text-3xl font-semibold tracking-[-0.03em] leading-tight rail:text-4xl">
                                {time ? <>It is {time} in {PROFILE.location}.</> : <>Based in {PROFILE.location}.</>}
                            </p>
                            <p className="mt-3 text-[var(--ink-soft)]">Say hello. I read everything.</p>
                            <p className="mt-6 select-all font-mono text-sm">{SOCIAL_LINKS.email}</p>
                        </div>
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            {([["LinkedIn", SOCIAL_LINKS.linkedin], ["X", SOCIAL_LINKS.x], ["GitHub", SOCIAL_LINKS.github], ["YouTube", SOCIAL_LINKS.youtube], ["Instagram", SOCIAL_LINKS.instagram]] as const).map(([name, href]) => (
                                <li key={name}>
                                    <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1">
                                        <span className="link">{name}</span>
                                        <ArrowUpRight size={13} className="text-[var(--ink-soft)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Panel>
            </div>
        </>
    );
}
