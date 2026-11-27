"use client";

// Small synthesised sound set. Everything is generated with the Web Audio API,
// so there are no audio files to load. Sounds stay silent until the visitor
// has interacted with the page, and the mute choice is remembered.

const STORAGE_KEY = "sfx-muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let muted = false;
let lastTick = 0;
let lastDetent = 0;
const listeners = new Set<(m: boolean) => void>();

if (typeof window !== "undefined") {
    try {
        muted = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch { }
}

function audio(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!ctx) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        ctx = new Ctor();
        master = ctx.createGain();
        master.gain.value = 0.7;
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -18;
        comp.ratio.value = 4;
        master.connect(comp);
        comp.connect(ctx.destination);
        // A short synthetic room, mixed in quietly, so sounds have a tail instead of stopping dead.
        const room = ctx.createConvolver();
        const len = Math.floor(ctx.sampleRate * 0.45);
        const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const d = impulse.getChannelData(ch);
            for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
        }
        room.buffer = impulse;
        const wet = ctx.createGain();
        wet.gain.value = 0.16;
        master.connect(room);
        room.connect(wet);
        wet.connect(comp);
    }
    return ctx;
}

// Returns a running context, or null when sound should not play right now.
function ready(): AudioContext | null {
    if (muted) return null;
    const c = audio();
    if (!c) return null;
    if (c.state !== "running") {
        // Queued sounds would all fire at once on the first click, so skip instead.
        c.resume().catch(() => { });
        return null;
    }
    return c;
}

type ToneOpts = { freq: number; to?: number; type?: OscillatorType; dur: number; peak: number; delay?: number; attack?: number };

function tone(c: AudioContext, { freq, to, type = "sine", dur, peak, delay = 0, attack = 0.004 }: ToneOpts) {
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
}

type NoiseOpts = { dur: number; peak: number; freq: number; to?: number; q?: number; filter?: BiquadFilterType; delay?: number };

function noise(c: AudioContext, { dur, peak, freq, to, q = 1, filter = "bandpass", delay = 0 }: NoiseOpts) {
    if (!noiseBuffer) {
        noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const t = c.currentTime + delay;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer;
    const f = c.createBiquadFilter();
    f.type = filter;
    f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.01, dur / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(gain);
    gain.connect(master!);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
}

// C major pentatonic across two octaves, so any sequence of notes sounds pleasant.
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];

// A soft plucked note: a fundamental with two quiet overtones and a felt-like thump.
function pluck(c: AudioContext, freq: number, peak = 0.11, delay = 0) {
    tone(c, { freq, dur: 0.9, peak, delay, attack: 0.006 });
    tone(c, { freq: freq * 2, dur: 0.45, peak: peak * 0.28, delay, attack: 0.004 });
    tone(c, { freq: freq * 3, dur: 0.22, peak: peak * 0.1, delay, attack: 0.003 });
    noise(c, { dur: 0.03, peak: peak * 0.25, freq: 1800, q: 0.8, delay });
}

// The same note played very gently: lower, rounder, no attack click. Used while scrolling.
function hum(c: AudioContext, freq: number) {
    tone(c, { freq, dur: 1.1, peak: 0.045, attack: 0.03 });
    tone(c, { freq: freq * 2, dur: 0.5, peak: 0.008, attack: 0.03 });
}

export const sfx = {
    /** Light wooden tick for hovering links and buttons. */
    tick() {
        const now = typeof performance !== "undefined" ? performance.now() : 0;
        if (now - lastTick < 45) return;
        lastTick = now;
        const c = ready();
        if (!c) return;
        tone(c, { freq: 1900, to: 1400, dur: 0.035, peak: 0.03 });
        noise(c, { dur: 0.018, peak: 0.018, freq: 4200, filter: "highpass" });
    },
    /** Soft pop for clicks. */
    tap() {
        const c = ready();
        if (!c) return;
        tone(c, { freq: 520, to: 230, type: "triangle", dur: 0.08, peak: 0.1 });
        noise(c, { dur: 0.022, peak: 0.045, freq: 2600, q: 1.2 });
    },
    /** The down-stroke of a click: a low, cushioned thock like a good key switch. */
    press() {
        const c = ready();
        if (!c) return;
        tone(c, { freq: 210, to: 95, dur: 0.07, peak: 0.2, attack: 0.002 });
        tone(c, { freq: 1250, to: 700, type: "triangle", dur: 0.025, peak: 0.035, attack: 0.001 });
        noise(c, { dur: 0.03, peak: 0.07, freq: 1500, q: 0.9 });
    },
    /** The up-stroke: lighter and brighter, so a click reads as two parts. */
    release() {
        const c = ready();
        if (!c) return;
        tone(c, { freq: 620, to: 880, dur: 0.045, peak: 0.055, attack: 0.002 });
        noise(c, { dur: 0.016, peak: 0.035, freq: 3800, filter: "highpass" });
    },
    /**
     * A quiet, low tick for long stretches of scrolling. Deliberately sparse and soft:
     * it should be felt more than heard.
     */
    detent() {
        const now = typeof performance !== "undefined" ? performance.now() : 0;
        if (now - lastDetent < 260) return;
        lastDetent = now;
        const c = ready();
        if (!c) return;
        tone(c, { freq: 330, to: 250, dur: 0.07, peak: 0.022, attack: 0.008 });
    },
    /** One plucked note per panel as the rail moves. */
    note(index: number) {
        const c = ready();
        if (!c) return;
        hum(c, SCALE[((index % SCALE.length) + SCALE.length) % SCALE.length] / 2);
    },
    /** A key on the little desk keyboard. `semitone` counts up from middle C. */
    key(semitone: number) {
        const c = ready();
        if (!c) return;
        pluck(c, 261.63 * Math.pow(2, semitone / 12), 0.16);
    },
    /** Air moving past as the rail jumps to a far panel. */
    slide() {
        const c = ready();
        if (!c) return;
        noise(c, { dur: 0.26, peak: 0.03, freq: 500, to: 2600, q: 0.7 });
    },
    /** Picking an object up off the table. */
    pick() {
        const c = ready();
        if (!c) return;
        tone(c, { freq: 300, to: 540, dur: 0.09, peak: 0.07 });
        noise(c, { dur: 0.05, peak: 0.02, freq: 3000, filter: "highpass" });
    },
    /** Putting it back down. */
    drop() {
        const c = ready();
        if (!c) return;
        tone(c, { freq: 190, to: 70, dur: 0.15, peak: 0.16 });
        noise(c, { dur: 0.05, peak: 0.07, freq: 700, filter: "lowpass" });
    },
    /** Two rising notes when something opens or starts playing. */
    open() {
        const c = ready();
        if (!c) return;
        pluck(c, SCALE[5], 0.08);
        pluck(c, SCALE[8], 0.08, 0.08);
    },
    /** Two falling notes when it closes. */
    close() {
        const c = ready();
        if (!c) return;
        pluck(c, SCALE[8], 0.07);
        pluck(c, SCALE[5], 0.07, 0.08);
    }
};

/** True once the browser has let audio start, which only happens after a click, tap or key press. */
export function isUnlocked() {
    return ctx?.state === "running";
}

export function isMuted() {
    return muted;
}

export function setMuted(next: boolean) {
    muted = next;
    try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch { }
    listeners.forEach(fn => fn(next));
    if (!next) {
        const c = audio();
        c?.resume().then(() => sfx.open()).catch(() => { });
    }
}

export function onMuteChange(fn: (m: boolean) => void) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
}

// Kept for existing callers.
export const playHoverSound = () => sfx.tick();
export const playClickSound = () => sfx.tap();

// Browsers only allow audio after a gesture, so wake the context on the first one.
if (typeof window !== "undefined") {
    const wake = () => {
        if (muted) return;
        const c = audio();
        if (c && c.state === "suspended") c.resume().then(() => listeners.forEach(fn => fn(muted))).catch(() => { });
    };
    ["pointerdown", "keydown", "touchstart"].forEach(evt =>
        window.addEventListener(evt, wake, { capture: true, passive: true })
    );
}
