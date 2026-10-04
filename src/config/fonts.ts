import type { FontVariant } from "../helpers/pixelFont/buildFont";

// In-game text is BitmapText in the bitByBit pixel font (#534), from one atlas
// built by `npm run fonts:build` (scripts/build-pixel-font.ts). The React UI
// keeps BoldPixels through CSS (globals.css). No runtime imports here: the
// build script reads this file under plain Node.

/** Texture key of the font atlas and its files under public/graphics/fonts/. */
export const FONT_ATLAS = "bitbybit";

/**
 * Bitmap font keys. White fills take any colour through `setTint`; a coloured
 * outline would be tinted too, so those schemes are baked as their own fonts.
 */
export const FONTS = {
    /** White, no outline. */
    plain: "bitbybit",
    /** White fill, 1px black outline. */
    outline: "bitbybit-outline",
    /** The magenta banners (AREA CLEARED, GAME OVER). */
    banner: "bitbybit-banner",
} as const;

/**
 * Font sizes are multiples of 8 so each font pixel covers whole screen pixels
 * (see FONT_SIZE in buildFont.ts); cap height is half the size.
 */
export const pixelFontSize = (scale: number): number => scale * 8;

/** Combat text fill per combat type; unknown or missing types are white. */
export const COMBAT_COLOURS: Readonly<Record<string, number>> = {
    physical: 0xffffff,
    magic: 0xeeff00,
    burn: 0xffaa00,
    bleed: 0xff3333,
    poison: 0x55cc55,
    heal: 0x77cc66,
    health: 0x99cc66,
    level: 0x88ff00,
};

const CRIT_OUTLINE = 0x880000;
const critFont = (type: string) => `bitbybit-crit-${type}`;

/** Font and tint for a combat number: crits are a baked dark-red outline. */
export function combatFont(type?: string, crit?: boolean): { font: string; tint: number } {
    const known = type !== undefined && Object.hasOwn(COMBAT_COLOURS, type);
    if (crit) return { font: critFont(known ? type : "physical"), tint: 0xffffff };
    return { font: FONTS.outline, tint: known ? COMBAT_COLOURS[type] : 0xffffff };
}

export const BANNER_FILL = 0xe0206a;
export const BANNER_SHADOW = 0x4a0020;

/** Banner drop-shadow depth, the old 3D extrusion: one font pixel. */
export const bannerDepth = (fontSize: number): number => Math.max(1, Math.round(fontSize / 8));

/** Every baked scheme in the atlas, in atlas order. */
export const FONT_VARIANTS: readonly FontVariant[] = [
    { key: FONTS.plain, fill: 0xffffff },
    { key: FONTS.outline, fill: 0xffffff, outline: 0x000000 },
    { key: FONTS.banner, fill: BANNER_FILL, outline: BANNER_SHADOW },
    ...Object.entries(COMBAT_COLOURS).map(([type, fill]) => ({
        key: critFont(type),
        fill,
        outline: CRIT_OUTLINE,
    })),
];
