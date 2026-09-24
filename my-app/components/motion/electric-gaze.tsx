"use client";

import React, { useEffect, useRef } from 'react';

// "Electric Gaze": a source image is sampled per cell, colour-adjusted, then
// ordered-dithered into accent-coloured blocks with an animated shimmer.
// Without a `src`, a procedural eye that follows the cursor is used as the source.

export type AnimStyle = "wave" | "pulse" | "shimmer" | "ripple" | "flicker";

export interface GazeParams {
    cellSize: number;       // px per cell
    coverage: number;       // % of cells allowed to draw
    invert: boolean;
    brightness: number;     // -100..100
    contrast: number;       // % (100 = unchanged)
    saturation: number;     // %
    grayscale: number;      // %
    density: number;        // 0..100, higher lights more cells
    tint: string;
    tintOpacity: number;    // %
    animated: boolean;
    animStyle: AnimStyle;
    animSpeed: number;      // 0..100
    animIntensity: number;  // 0..100
    color: string;          // colour of lit cells
    highlight: string;      // colour of the brightest cells
}

export const ELECTRIC_GAZE: GazeParams = {
    cellSize: 9,
    coverage: 100,
    invert: false,
    brightness: 0,
    contrast: 158,
    saturation: 100,
    grayscale: 0,
    density: 20,
    tint: "#3ca6ff",
    tintOpacity: 0,
    animated: true,
    animStyle: "shimmer",
    animSpeed: 100,
    animIntensity: 60,
    color: "#ffdf00",
    highlight: "#fff066"
};

const BAYER4 = [
    0, 8, 2, 10,
    12, 4, 14, 6,
    3, 11, 1, 9,
    15, 7, 13, 5
].map(v => (v + 0.5) / 16);

const hash = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
};

const hexToRgb = (hex: string) => {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

interface Gaze { x: number; y: number; open: number; t: number }

// Procedural source: an almond eye with an electric iris, drawn at grid resolution.
function drawEye(ctx: CanvasRenderingContext2D, w: number, h: number, g: Gaze) {
    const cx = w / 2;
    const cy = h / 2;
    const s = Math.min(w, h);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    // faint concentric field lines
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = 0; i < 4; i++) {
        const r = s * (0.46 + i * 0.1) + Math.sin(g.t * 1.5 + i) * s * 0.01;
        ctx.strokeStyle = `rgba(255,255,255,${0.16 - i * 0.03})`;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    const ew = s * 0.48;
    const eh = s * 0.27 * g.open;
    const lid = () => {
        ctx.beginPath();
        ctx.moveTo(cx - ew, cy);
        ctx.quadraticCurveTo(cx, cy - eh * 2, cx + ew, cy);
        ctx.quadraticCurveTo(cx, cy + eh * 2, cx - ew, cy);
        ctx.closePath();
    };

    ctx.save();
    lid();
    const sclera = ctx.createRadialGradient(cx, cy, 0, cx, cy, ew);
    sclera.addColorStop(0, "rgba(200,200,200,0.55)");
    sclera.addColorStop(1, "rgba(60,60,60,0.35)");
    ctx.fillStyle = sclera;
    ctx.fill();
    ctx.clip();

    const ix = cx + g.x * ew * 0.45;
    const iy = cy + g.y * eh * 0.5;
    const ir = s * 0.2;

    const iris = ctx.createRadialGradient(ix, iy, ir * 0.3, ix, iy, ir);
    iris.addColorStop(0, "#fff");
    iris.addColorStop(0.55, "#bbb");
    iris.addColorStop(0.9, "#555");
    iris.addColorStop(1, "#111");
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.arc(ix, iy, ir, 0, Math.PI * 2);
    ctx.fill();

    // electric fibres crackling out of the pupil
    ctx.lineWidth = Math.max(1, s * 0.01);
    for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2 + g.t * 0.35;
        const flick = 0.55 + 0.45 * Math.sin(g.t * 9 + i * 2.3);
        const r0 = ir * 0.38;
        const r1 = ir * (0.75 + 0.25 * flick);
        const bend = Math.sin(g.t * 4 + i) * 0.18;
        ctx.strokeStyle = `rgba(0,0,0,${0.35 + 0.4 * (1 - flick)})`;
        ctx.beginPath();
        ctx.moveTo(ix + Math.cos(a) * r0, iy + Math.sin(a) * r0);
        ctx.quadraticCurveTo(
            ix + Math.cos(a + bend) * (r0 + r1) / 2, iy + Math.sin(a + bend) * (r0 + r1) / 2,
            ix + Math.cos(a) * r1, iy + Math.sin(a) * r1
        );
        ctx.stroke();
    }

    const pr = ir * (0.36 + 0.05 * Math.sin(g.t * 2));
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(ix, iy, pr, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ix - ir * 0.32, iy - ir * 0.32, ir * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // lids and lashes
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = Math.max(1.5, s * 0.022);
    lid();
    ctx.stroke();
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = 1; i < 10; i++) {
        const u = i / 10;
        const px = cx - ew + u * ew * 2;
        const py = cy - eh * 2 * 2 * u * (1 - u);
        const ang = -Math.PI / 2 + (u - 0.5) * 1.6;
        const len = s * 0.07 * (0.6 + Math.sin(u * Math.PI) * 0.6) * (0.3 + 0.7 * g.open);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(ang) * len, py + Math.sin(ang) * len);
        ctx.stroke();
    }
}

interface ElectricGazeProps {
    src?: string;
    params?: Partial<GazeParams>;
    className?: string;
}

export function ElectricGaze({ src, params, className = "" }: ElectricGazeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const paramsRef = useRef<GazeParams>({ ...ELECTRIC_GAZE, ...params });
    useEffect(() => {
        paramsRef.current = { ...ELECTRIC_GAZE, ...params };
    }, [params]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const sample = document.createElement("canvas");
        const sctx = sample.getContext("2d", { willReadFrequently: true });
        if (!ctx || !sctx) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let img: HTMLImageElement | null = null;
        if (src) {
            img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
        }

        let width = 0;
        let height = 0;
        let dpr = 1;
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const gaze: Gaze = { x: 0, y: 0, open: 1, t: 0 };
        const target = { x: 0, y: 0 };
        let lastPointer = 0;
        const onPointer = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            target.x = Math.max(-1, Math.min(1, dx / (window.innerWidth * 0.4)));
            target.y = Math.max(-1, Math.min(1, dy / (window.innerHeight * 0.4)));
            lastPointer = performance.now();
        };
        window.addEventListener("pointermove", onPointer);

        let visible = true;
        const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
        io.observe(canvas);

        let nextBlink = performance.now() + 2500;
        let raf = 0;

        const render = (now: number) => {
            const p = paramsRef.current;
            const t = now / 1000;
            gaze.t = t;

            // idle wander when the pointer has been still for a while
            if (now - lastPointer > 3000) {
                target.x = Math.sin(t * 0.5) * 0.6;
                target.y = Math.sin(t * 0.37) * 0.3;
            }
            gaze.x += (target.x - gaze.x) * 0.08;
            gaze.y += (target.y - gaze.y) * 0.08;
            if (now > nextBlink) {
                const k = (now - nextBlink) / 180;
                gaze.open = k < 1 ? 1 - k : k < 2 ? k - 1 : 1;
                if (k >= 2) nextBlink = now + 2500 + Math.random() * 3500;
            }

            const cs = p.cellSize;
            const cols = Math.max(1, Math.ceil(width / cs));
            const rows = Math.max(1, Math.ceil(height / cs));
            if (sample.width !== cols || sample.height !== rows) {
                sample.width = cols;
                sample.height = rows;
            }

            // 1-2. draw the source at grid resolution so each pixel is a cell average
            if (img && img.complete && img.naturalWidth) {
                const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
                const dw = img.naturalWidth * scale;
                const dh = img.naturalHeight * scale;
                sctx.fillStyle = "#000";
                sctx.fillRect(0, 0, cols, rows);
                sctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
            } else {
                drawEye(sctx, cols, rows, gaze);
            }
            const data = sctx.getImageData(0, 0, cols, rows).data;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            const contrast = p.contrast / 100;
            const bright = p.brightness * 2.55;
            const sat = p.saturation / 100;
            const gray = p.grayscale / 100;
            const [tr, tg, tb] = hexToRgb(p.tint);
            const tintA = p.tintOpacity / 100;
            const densityBias = (p.density - 50) / 250;
            const speed = p.animated ? p.animSpeed / 100 : 0;
            const amp = p.animated ? (p.animIntensity / 100) * 0.35 : 0;
            const phase = t * speed * 2.2;
            const gap = cs >= 6 ? 1 : 0;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (p.coverage < 100 && hash(x, y) * 100 >= p.coverage) continue;
                    const i = (y * cols + x) * 4;
                    let r = data[i], g = data[i + 1], b = data[i + 2];

                    // 4. brightness, contrast, saturation, grayscale, tint
                    r = (r - 128) * contrast + 128 + bright;
                    g = (g - 128) * contrast + 128 + bright;
                    b = (b - 128) * contrast + 128 + bright;
                    const l0 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    const k = sat * (1 - gray);
                    r = l0 + (r - l0) * k;
                    g = l0 + (g - l0) * k;
                    b = l0 + (b - l0) * k;
                    if (tintA > 0) {
                        r = r * (1 - tintA) + (r * tr / 255) * tintA;
                        g = g * (1 - tintA) + (g * tg / 255) * tintA;
                        b = b * (1 - tintA) + (b * tb / 255) * tintA;
                    }
                    let lum = Math.max(0, Math.min(1, (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255));
                    if (p.invert) lum = 1 - lum;

                    // 8. animation perturbs the dither threshold
                    let mod = 0;
                    switch (p.animStyle) {
                        case "shimmer": {
                            const band = Math.pow(Math.max(0, Math.sin((x + y) * 0.09 - phase)), 12);
                            mod = band * amp * 1.4 + (hash(x, y + Math.floor(t * 12 * speed)) - 0.5) * amp * 0.35;
                            break;
                        }
                        case "wave":
                            mod = Math.sin(x * 0.18 + phase) * Math.cos(y * 0.12 - phase * 0.7) * amp;
                            break;
                        case "pulse":
                            mod = Math.sin(phase * 1.5) * amp * 0.6;
                            break;
                        case "ripple": {
                            const d = Math.hypot(x - cols / 2, y - rows / 2);
                            mod = Math.sin(d * 0.35 - phase * 2) * amp * 0.6;
                            break;
                        }
                        case "flicker":
                            mod = (hash(x, y + Math.floor(t * 20 * speed)) - 0.5) * amp;
                            break;
                    }

                    const threshold = BAYER4[(y & 3) * 4 + (x & 3)] - densityBias;
                    const v = lum + mod;
                    if (v <= threshold) continue;

                    const hot = v > 1.05;
                    ctx.globalAlpha = Math.min(1, 0.2 + v * 0.8);
                    ctx.fillStyle = hot ? p.highlight : p.color;
                    ctx.fillRect(x * cs, y * cs, cs - gap, cs - gap);
                }
            }
            ctx.globalAlpha = 1;
        };

        const loop = (now: number) => {
            if (visible && !document.hidden) render(now);
            if (!reduce) raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        if (img) img.onload = () => { if (reduce) render(performance.now()); };

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("pointermove", onPointer);
        };
    }, [src]);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
