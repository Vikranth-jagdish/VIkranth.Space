"use client";

import { useEffect, useState } from "react";

type Bend = { w: number; h: number; zone: number; scale: number; left: string; right: string };

// Lens constants. The lens is a box a little wider than the screen, so its rim
// sits just off each side. Pixels near the rim are drawn from further towards the
// centre of the screen, more and more steeply the closer they are to the rim.
const SPAN_X = 0.525;     // lens half-width as a share of the viewport width
const STRENGTH = 1.471;   // overall refraction
const GAIN = 0.01;        // offset per unit of strength, as a share of the viewport
const GATE_FULL = 0.08;   // inside this distance from the rim the bend is at full strength
const GATE_END = 0.2;     // by this distance it has faded to nothing
const MELT = 0.11;        // how far in from the rim the image stays fully melted
const MAX_SHIFT = 130;    // cap on the offset in px: an 8-bit map this size still moves in sub-pixel steps
const CHROMA = { r: 0.95, g: 1, b: 1.25 };

const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};

/**
 * Build the displacement map for one side strip.
 * Red and green hold the sideways and vertical offsets, blue holds how much
 * of the blurred copy to mix in.
 */
function makeMap(right: boolean, stripW: number, vw: number, vh: number, maxShift: number) {
    const step = 2;
    const cw = Math.ceil(stripW / step);
    const ch = Math.ceil(vh / step);
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const g = canvas.getContext("2d");
    if (!g) return "";
    const img = g.createImageData(cw, ch);
    const sx = vw * SPAN_X;
    const sy = vh;
    const unit = Math.min(sx, sy);
    for (let j = 0; j < ch; j++) {
        for (let i = 0; i < cw; i++) {
            // Screen x of this map pixel. The right strip is anchored to the right edge.
            const x = right ? vw - stripW + (i + 0.5) * step : (i + 0.5) * step;
            const y = (j + 0.5) * step;
            const rx = x - vw / 2;
            const ry = y - vh / 2;
            const c = (Math.abs(rx) - sx) / unit;                  // negative inside the lens, 0 at the rim
            const depth = Math.max(-c, 1e-3);
            const gate = 1 - smoothstep(GATE_FULL, GATE_END, depth);
            const k = (STRENGTH * GAIN * gate) / depth;
            let dx = -(rx / sx) * k * vw;
            let dy = -(ry / sy) * k * vh;
            const len = Math.hypot(dx, dy);
            if (len > maxShift) { dx *= maxShift / len; dy *= maxShift / len; }
            const melt = Math.min(1, Math.max((gate * MELT) / depth, Math.sqrt(gate) * 0.65));
            const o = (j * cw + i) * 4;
            img.data[o] = Math.round(127.5 + (dx / maxShift) * 127.5);
            img.data[o + 1] = Math.round(127.5 + (dy / maxShift) * 127.5);
            img.data[o + 2] = melt * 255;
            img.data[o + 3] = 255;
        }
    }
    g.putImageData(img, 0, 0);
    return canvas.toDataURL();
}

function Filter({ id, map, w, h, scale }: { id: string; map: string; w: number; h: number; scale: number }) {
    const channel = (name: string, k: number, matrix: string) => (
        <>
            <feDisplacementMap in="SourceGraphic" in2="map" scale={scale * k} xChannelSelector="R" yChannelSelector="G" result={`${name}d`} />
            <feColorMatrix in={`${name}d`} type="matrix" values={matrix} result={name} />
        </>
    );
    return (
        <filter id={id} x="0" y="0" width={w} height={h} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map} x="0" y="0" width={w} height={h} preserveAspectRatio="none" result="map" />
            {/* Each colour is bent by a different amount, which gives the fringe at the rim. */}
            {channel("r", CHROMA.r, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0")}
            {channel("g", CHROMA.g, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0")}
            {channel("b", CHROMA.b, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0")}
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" result="sharp" />
            {/* The melt: a blurred copy, mixed in more strongly towards the rim. */}
            <feGaussianBlur in="sharp" stdDeviation="6 3" result="soft" />
            <feColorMatrix in="map" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 1 0 0" result="amount" />
            <feComposite in="soft" in2="amount" operator="in" result="melt" />
            <feMerge>
                <feMergeNode in="sharp" />
                <feMergeNode in="melt" />
            </feMerge>
        </filter>
    );
}

/** Glass-like bend at the left and right edges of the home rail. */
export function EdgeBend() {
    const [bend, setBend] = useState<Bend | null>(null);

    useEffect(() => {
        // Only Chromium can use an SVG filter as a backdrop; other browsers keep the soft blur.
        const supported = /Chrome\//.test(navigator.userAgent) && CSS.supports("backdrop-filter", "blur(1px)");
        let timer = 0;
        const build = () => {
            if (!supported) { setBend(null); return; }
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const unit = Math.min(vw * SPAN_X, vh);
            // Width of the bend itself, plus room for the furthest pixel it reads from.
            const zone = GATE_END * unit - (vw * SPAN_X - vw / 2);
            // Smaller screens get a proportionally smaller reach.
            const shift = Math.min(MAX_SHIFT, Math.round(zone * 1.15));
            const w = Math.min(Math.ceil(zone + shift * CHROMA.b + 8), Math.floor(vw / 2));
            setBend({ w, h: vh, zone: Math.ceil(zone), scale: shift * 2, left: makeMap(false, w, vw, vh, shift), right: makeMap(true, w, vw, vh, shift) });
        };
        const onResize = () => { window.clearTimeout(timer); timer = window.setTimeout(build, 120); };
        build();
        window.addEventListener("resize", onResize);
        return () => { window.clearTimeout(timer); window.removeEventListener("resize", onResize); };
    }, []);

    // The strip is wider than the bend because it also has to cover the pixels the bend
    // reads from. The mask keeps only the bend itself, so the rest of the strip shows the page untouched.
    const glass = (side: "left" | "right") => {
        if (!bend) return undefined;
        const mask = `linear-gradient(to ${side === "left" ? "right" : "left"}, #000 ${bend.zone - 14}px, transparent ${bend.zone + 6}px)`;
        return { width: bend.w, backdropFilter: `url(#edge-bend-${side})`, WebkitMaskImage: mask, maskImage: mask };
    };

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
            {bend && (
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <Filter id="edge-bend-left" map={bend.left} w={bend.w} h={bend.h} scale={bend.scale} />
                        <Filter id="edge-bend-right" map={bend.right} w={bend.w} h={bend.h} scale={bend.scale} />
                    </defs>
                </svg>
            )}
            <div className="edge-glass left-0" style={glass("left")} />
            <div className="edge-glass edge-glass-right right-0" style={glass("right")} />
        </div>
    );
}
