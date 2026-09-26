import type { Types } from "phaser";
import boldPixelsUrl from "../styles/fonts/boldpixels.woff2?url";

/**
 * The game's single typeface: BoldPixels by YukiPixels (CC BY-SA 4.0, see
 * src/styles/fonts/BoldPixels-LICENSE.txt). The same vendored woff2 backs the
 * CSS @font-face in globals.css (React UI) and BootScene's `load.font` (canvas
 * Text), so both layers render the one face.
 */
export const FONT_FAMILY = "BoldPixels";
export const FONT_URL: string = boldPixelsUrl;

/**
 * Style for the big in-game banners (GAME OVER, AREA CLEARED) that used the
 * magenta `wayne-3d` retro bitmap font: same colour family, with a dark stroke
 * and an offset shadow standing in for its 3D extrusion.
 */
export function bannerStyle(fontSize: number): Types.GameObjects.Text.TextStyle {
    const depth = Math.max(1, Math.round(fontSize / 16));
    return {
        fontFamily: FONT_FAMILY,
        fontSize: `${fontSize}px`,
        color: "#e0206a",
        stroke: "#4a0020",
        strokeThickness: Math.max(2, Math.round(fontSize / 8)),
        shadow: {
            offsetX: depth,
            offsetY: depth,
            color: "#4a0020",
            blur: 0,
            stroke: true,
            fill: true,
        },
    };
}
