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
            className={`md:absolute select-none ${drag ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
        >
            {children}
        </motion.div>
    );
}

const FINE_POINTER = "(min-width: 768px) and (pointer: fine)";
function subscribeFinePointer(fn: () => void) {
    const mq = window.matchMedia(FINE_POINTER);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
}

const shadow = "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_12px_26px_rgba(0,0,0,0.12)]";

function CareerObjects() {
    const bounds = useRef<HTMLDivElement>(null);
    const drag = useSyncExternalStore(subscribeFinePointer, () => window.matchMedia(FINE_POINTER).matches, () => false);
    const [hp, botcode, dao, vnest, thinkroot] = EXPERIENCE;
    return (
        <div ref={bounds} className="relative grid grid-cols-2 items-center gap-6 md:block md:h-full">
            <Thing bounds={bounds} drag={drag} rotate={-3} className="md:left-[2%] md:top-[6%] md:w-[230px]">
                <div className={`overflow-hidden rounded-xl bg-white ${shadow}`}>
                    <div className="flex h-12 items-center justify-center bg-[var(--blue)]"><span className="h-2 w-12 rounded-full bg-white/40" /></div>
                    <div className="p-4">
                        <p className="text-lg font-semibold tracking-tight">{hp.company}</p>
                        <p className="text-sm text-[var(--ink-soft)]">{hp.title}</p>
                        <p className="label mt-4">{hp.years}</p>
                    </div>
                </div>
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={4} className="md:left-[42%] md:top-[4%] md:w-[250px]">
                <div className={`relative grid aspect-[4/3] place-items-center bg-[#d3b488] ${shadow}`}>
                    <span className="absolute inset-x-0 top-0 h-[46%] border-b border-black/15" />
                    <span className="hand relative bg-[#fffbe0] px-2 py-1">{botcode.company.split(" ")[0]}, {botcode.years.slice(0, 4)}</span>
                </div>
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={-6} className="md:right-[2%] md:top-[30%] md:w-[150px]">
                <div className={`grid aspect-square place-items-center rounded-full border-[3px] border-double border-[var(--ink)] bg-white p-4 text-center ${shadow}`}>
                    <div>
                        <p className="label !text-[var(--ink)]">{dao.title}</p>
                        <p className="mt-1 text-sm font-semibold leading-tight">DAO Community</p>
                        <p className="label mt-1">{dao.years}</p>
                    </div>
                </div>
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={2} className="md:left-[6%] md:bottom-[4%] md:w-[190px]">
                <div className={`flex aspect-square flex-col justify-between bg-[var(--marker)] p-4 ${shadow}`}>
                    <span className="hand !text-[26px]">{vnest.company}</span>
                    <span className="hand">{vnest.title.toLowerCase()}, startup incubator</span>
                </div>
            </Thing>
            <Thing bounds={bounds} drag={drag} rotate={-1.5} className="col-span-2 md:left-[36%] md:bottom-[6%] md:w-[300px]">
                <div className={`relative grid aspect-[2/1] place-items-center border-2 border-[var(--ink)] bg-[#f7f1e0] ${shadow}`}>
                    <span className="absolute inset-y-0 left-1/2 w-0.5 bg-[var(--ink)]" />
                    <span className="hand relative bg-[#f7f1e0] px-2">{thinkroot.company} internship, {thinkroot.years}</span>
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
                        <p className="text-7xl font-semibold tracking-[-0.05em] leading-none tabular-nums md:text-8xl">
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

export default function Rail({ photos }: { photos: Photo[] }) {
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
        if (window.matchMedia("(min-width: 768px)").matches) {
            rail.scrollTo({ left: el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
        } else {
            el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }
    }, [panels, reduce]);

    // Vertical wheel movement drives the rail sideways, eased towards a target.
    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return;
        const wide = window.matchMedia("(min-width: 768px)");
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
            if (!wide.matches || e.ctrlKey) return;
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
            const horizontal = wide.matches;
            const mid = horizontal ? window.innerWidth / 2 : window.innerHeight * 0.4;
            let best = 0;
            let bestDist = Infinity;
            list.forEach((el, i) => {
                const r = el.getBoundingClientRect();
                const start = horizontal ? r.left : r.top;
                const end = horizontal ? r.right : r.bottom;
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

    const homeVideos = VIDEOS.filter(v => !v.wide).slice(0, 4);
    const edit = VIDEOS.find(v => v.wide);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 bg-[var(--wall)]/85 px-4 py-4 backdrop-blur md:bg-transparent md:px-8 md:backdrop-blur-none">
                <span className="text-sm font-medium">{PROFILE.name}</span>
                <nav aria-label="Sections" className="hidden items-center gap-1.5 md:flex">
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

            <div ref={railRef} className="rail">
                {/* Intro */}
                <Panel id="intro" className="md:w-[600px]">
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
                            <span className="label hidden md:block">Scroll, or use arrow keys</span>
                        </div>
                    </div>
                </Panel>

                {/* Career */}
                <Panel id="career" className="md:w-[820px]">
                    <div className="flex h-full flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <p className="label">Career</p>
                            <More href="/experience">Full experience</More>
                        </div>
                        <div className="min-h-0 flex-1"><CareerObjects /></div>
                        <p className="hand hidden text-[var(--ink-soft)] md:block">pick things up, move them around</p>
                    </div>
                </Panel>

                {/* Work */}
                <Panel id="work-title" className="md:w-[420px] md:!px-0">
                    <div className="grid h-full place-items-center"><p className="panel-word">Work</p></div>
                </Panel>
                <Panel id="work" className="md:w-[560px]">
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
                <Panel id="videos-title" className="md:w-[420px] md:!px-0">
                    <div className="grid h-full place-items-center"><p className="panel-word">Off hours</p></div>
                </Panel>
                <Panel id="videos" className="md:w-[1120px]">
                    <div className="flex h-full flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <p className="label">Piano and video edits</p>
                            <More href="/videos">All videos</More>
                        </div>
                        <div className="grid min-h-0 flex-1 grid-cols-2 items-start gap-5 md:grid-cols-[repeat(4,172px)_minmax(0,1fr)] md:content-center md:items-center md:gap-6">
                            {homeVideos.map(v => <VideoTile key={v.id} video={v} />)}
                            {edit && <VideoTile video={edit} className="col-span-2 md:col-span-1" />}
                        </div>
                    </div>
                </Panel>

                {/* Music */}
                <Panel id="music" className="md:w-[380px]">
                    <MusicPanel />
                </Panel>

                {/* Stats */}
                <Panel id="stats" className="md:w-[460px]">
                    <StatsPanel />
                </Panel>

                {/* Photos */}
                <Panel id="photos" className="md:w-[640px]">
                    <div className="flex h-full flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <p className="label">Photos</p>
                            <More href="/photos">Gallery</More>
                        </div>
                        {photos.length > 0 ? (
                            <div className="flex min-h-0 flex-1 items-center justify-center">
                                {photos.slice(0, 3).map((p, i) => (
                                    <div
                                        key={p.id}
                                        className={`w-[36%] flex-none bg-white p-2 pb-8 ${shadow} ${i === 1 ? "z-10 -mx-4" : ""}`}
                                        style={{ transform: `rotate(${[-5, 2, 6][i]}deg)` }}
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
                <Panel id="writing-title" className="md:w-[420px] md:!px-0">
                    <div className="grid h-full place-items-center"><p className="panel-word">Notes</p></div>
                </Panel>
                <Panel id="writing" className="md:w-[560px]">
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
                <Panel id="contact" className="md:w-[520px]">
                    <div className="flex h-full flex-col justify-between gap-10">
                        <p className="label">Contact</p>
                        <div>
                            <p className="text-3xl font-semibold tracking-[-0.03em] leading-tight md:text-4xl">
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
