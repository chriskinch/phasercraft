import { darken } from "polished";
import type { CSSProperties } from "react";

/*
 * These helpers used to return CSS strings that were interpolated into
 * styled-jsx blocks. The styling itself now lives in themes.module.css; what
 * remains here is the *dynamic* part — the per-render colour values — which we
 * hand to CSS as custom properties via an inline `style` object. Colour maths
 * (polished's darken) still runs in JS; only its result travels through a var.
 */

interface PixelBackgroundOptions {
    bg_color?: string;
}

export const pixelBackgroundVars = ({
    bg_color = "#e4f6f7",
}: PixelBackgroundOptions = {}): CSSProperties =>
    ({
        "--pb-bg": bg_color,
        "--pb-bg-dark": darken(0.3, bg_color),
    }) as CSSProperties;

interface PixelEmbossOptions {
    rgb?: string;
    a?: number;
}

export const pixelEmbossVars = ({ rgb, a }: PixelEmbossOptions = {}): CSSProperties => {
    // Omitting both leaves the CSS Module's defaults (rgba(0,0,0,0.1) /
    // rgba(0,0,0,0.3)) in place, matching the old pixel_emboss() call.
    if (rgb === undefined && a === undefined) return {};
    const r = rgb ?? "0,0,0";
    const alpha = a ?? 0.1;
    return {
        "--pe-fill": `rgba(${r},${alpha})`,
        "--pe-shadow": `rgba(${r},${alpha * 3})`,
    } as CSSProperties;
};
