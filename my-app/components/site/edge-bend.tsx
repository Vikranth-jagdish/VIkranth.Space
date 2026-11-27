"use client";

import { useEffect, useState } from "react";

type Bend = { w: number; h: number; left: string; right: string };

// A displacement map for one edge strip. Red bends pixels sideways, green bends
// them vertically; both grow towards the outer edge so content appears to curve
// away like it is passing behind thick glass.
function makeMap(right: boolean) {
    const size = 96;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const g = canvas.getContext("2d");
    if (!g) return "";
    const img = g.createImageData(size, size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const u = (right ? size - 1 - x : x) / (size - 1); // 0 at the outer edge
            const v = y / (size - 1);
            const s = Math.pow(1 - u, 2.2);
            const i = (y * size + x) * 4;
            img.data[i] = 127.5 + (right ? -1 : 1) * 127.5 * s;
            img.data[i + 1] = 127.5 + (0.5 - v) * 2 * 127.5 * s * 0.55;
            img.data[i + 2] = 0;
            img.data[i + 3] = 255;
        }
    }
    g.putImageData(img, 0, 0);
    return canvas.toDataURL();
}

function Filter({ id, map, w, h }: { id: string; map: string; w: number; h: number }) {
    const scale = w * 0.95;
    const channel = (name: string, k: number, matrix: string) => (
        <>
            <feDisplacementMap in="SourceGraphic" in2="map" scale={scale * k} xChannelSelector="R" yChannelSelector="G" result={`${name}d`} />
            <feColorMatrix in={`${name}d`} type="matrix" values={matrix} result={name} />
        </>
    );
    return (
        <filter id={id} x="0" y="0" width={w} height={h} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map} x="0" y="0" width={w} height={h} preserveAspectRatio="none" result="map" />
            {/* Each colour bends a little further than the last, which gives the fringe at the rim. */}
            {channel("r", 1, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0")}
            {channel("g", 1.1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0")}
            {channel("b", 1.22, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0")}
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" result="rgb" />
            <feGaussianBlur in="rgb" stdDeviation="0.7" />
        </filter>
    );
}

/** Glass-like bend at the left and right edges of the home rail. */
export function EdgeBend() {
    const [bend, setBend] = useState<Bend | null>(null);

    useEffect(() => {
        const wide = window.matchMedia("(min-width: 768px)");
        // Only Chromium can use an SVG filter as a backdrop; other browsers keep the soft blur.
        const supported = /Chrome\//.test(navigator.userAgent) && !/Edg\/1[0-1]\d/.test(navigator.userAgent) && CSS.supports("backdrop-filter", "blur(1px)");
        let left = "";
        let right = "";
        const build = () => {
            if (!wide.matches || !supported) { setBend(null); return; }
            left ||= makeMap(false);
            right ||= makeMap(true);
            setBend({ w: Math.round(Math.min(240, Math.max(120, window.innerWidth * 0.12))), h: window.innerHeight, left, right });
        };
        build();
        window.addEventListener("resize", build);
        return () => window.removeEventListener("resize", build);
    }, []);

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 hidden md:block">
            {bend && (
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <Filter id="edge-bend-left" map={bend.left} w={bend.w} h={bend.h} />
                        <Filter id="edge-bend-right" map={bend.right} w={bend.w} h={bend.h} />
                    </defs>
                </svg>
            )}
            <div
                className="edge-glass left-0"
                style={bend ? { width: bend.w, backdropFilter: "url(#edge-bend-left)", WebkitMaskImage: "none", maskImage: "none" } : undefined}
            />
            <div
                className="edge-glass right-0 edge-glass-right"
                style={bend ? { width: bend.w, backdropFilter: "url(#edge-bend-right)", WebkitMaskImage: "none", maskImage: "none" } : undefined}
            />
            {/* A faint sheen where the glass meets the edge of the screen. */}
            <div className="edge-sheen left-0" />
            <div className="edge-sheen right-0 -scale-x-100" />
        </div>
    );
}
