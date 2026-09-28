// Safe-area insets (notch / Dynamic Island / home indicator) for the canvas.
//
// The Phaser canvas runs edge to edge under the notch, so scenes keep their HUD
// clear of it by shrinking the layout zone by these insets. CSS exposes them
// only through env(), so globals.css mirrors each into a --safe-area-* custom
// property on :root, which getComputedStyle can read as a resolved px value.

import type { Rect } from "./walkability";

export interface SafeAreaInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

const SIDES = ["top", "right", "bottom", "left"] as const;

// Reads the current insets in CSS px. Missing/unparsable values (no notch,
// non-browser test env) read as 0.
export function readSafeAreaInsets(): SafeAreaInsets {
    const style = getComputedStyle(document.documentElement);
    const insets = { top: 0, right: 0, bottom: 0, left: 0 };
    for (const side of SIDES) {
        const value = parseFloat(style.getPropertyValue(`--safe-area-${side}`));
        insets[side] = Number.isFinite(value) ? value : 0;
    }
    return insets;
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
