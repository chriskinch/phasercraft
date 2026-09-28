// Safe-area insets (notch / Dynamic Island / home indicator) for the HUD.
//
// The Phaser canvas runs edge to edge under the notch, so scenes keep their HUD
// clear of it by shrinking their layout zone by these insets, and the React HUD
// pads by the same values (mirrored into --hud-inset-* on :root).
//
// iOS can report the insets late (e.g. 0 at launch, the real value only after
// returning from the app switcher) and moves the notch to the other side when
// the phone is rotated 180°. So that the HUD settles once and then stays put,
// the insets used for layout are:
//   - symmetric horizontally: max(left, right) on both sides, so a rotation
//     that swaps the notch side changes nothing;
//   - sticky: each value only ever grows for the session, so a transient 0
//     (app switcher, orientation animation) never pulls the HUD back.
//
// CSS exposes the insets only through env(), so two hidden probe elements are
// sized by them; a ResizeObserver on the probes reports any change, and the
// insets are re-read when the page becomes visible again.

import type { Rect } from "./walkability";

export interface SafeAreaInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

const NO_INSETS: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

// Combines freshly read insets into the layout insets: symmetric horizontally
// and never smaller than the previous layout insets.
export function hudInsets(raw: SafeAreaInsets, previous: SafeAreaInsets): SafeAreaInsets {
    const x = Math.max(previous.left, previous.right, raw.left, raw.right);
    return {
        top: Math.max(previous.top, raw.top),
        right: x,
        bottom: Math.max(previous.bottom, raw.bottom),
        left: x,
    };
}

// The layout rect for a width x height canvas: inset by the safe area, then by
// the scene's own padding on every side.
export function safeZoneRect(
    width: number,
    height: number,
    padding: number,
    insets: SafeAreaInsets
): Rect {
    return {
        x: insets.left + padding,
        y: insets.top + padding,
        width: width - insets.left - insets.right - padding * 2,
        height: height - insets.top - insets.bottom - padding * 2,
    };
}

const sameInsets = (a: SafeAreaInsets, b: SafeAreaInsets): boolean =>
    a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left;

// Process-wide watcher state. Created lazily on first use and kept for the
// page's lifetime (the probes and document listeners are page-level, like the
// Phaser game itself); scenes attach and detach listeners.
let current: SafeAreaInsets = NO_INSETS;
let probes: { topLeft: HTMLElement; bottomRight: HTMLElement } | null = null;
const listeners = new Set<() => void>();

function makeProbe(width: string, height: string): HTMLElement {
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    Object.assign(probe.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width,
        height,
        visibility: "hidden",
        pointerEvents: "none",
    });
    document.body.appendChild(probe);
    return probe;
}

function readRawInsets(): SafeAreaInsets {
    if (!probes) return NO_INSETS;
    const tl = probes.topLeft.getBoundingClientRect();
    const br = probes.bottomRight.getBoundingClientRect();
    return { top: tl.height, left: tl.width, bottom: br.height, right: br.width };
}

function refresh(): void {
    const next = hudInsets(readRawInsets(), current);
    if (sameInsets(next, current)) return;
    current = next;
    const root = document.documentElement.style;
    root.setProperty("--hud-inset-top", `${next.top}px`);
    root.setProperty("--hud-inset-bottom", `${next.bottom}px`);
    root.setProperty("--hud-inset-x", `${next.left}px`);
    listeners.forEach((listener) => listener());
}

function ensureWatching(): void {
    if (probes || typeof document === "undefined") return;
    probes = {
        topLeft: makeProbe("env(safe-area-inset-left, 0px)", "env(safe-area-inset-top, 0px)"),
        bottomRight: makeProbe(
            "env(safe-area-inset-right, 0px)",
            "env(safe-area-inset-bottom, 0px)"
        ),
    };
    if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(refresh);
        observer.observe(probes.topLeft);
        observer.observe(probes.bottomRight);
    }
    // Returning to the app (app switcher, tab switch, bfcache restore): re-read
    // on the next frame, once the browser has applied the restored layout.
    const recheck = () => requestAnimationFrame(refresh);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") recheck();
    });
    window.addEventListener("pageshow", recheck);
    window.addEventListener("focus", recheck);
    refresh();
}

// The current layout insets (see the header for how they're derived).
export function getHudInsets(): SafeAreaInsets {
    ensureWatching();
    return current;
}

// Calls listener whenever the layout insets change. Returns an unsubscribe
// function; release it when the owner goes away.
export function watchHudInsets(listener: () => void): () => void {
    ensureWatching();
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
