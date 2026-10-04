import { describe, it, expect } from "vitest";
import { bannerDepth, combatFont, FONT_VARIANTS, FONTS, pixelFontSize } from "./fonts";

describe("combatFont", () => {
    it("tints the outlined font by combat type, white when unknown", () => {
        expect(combatFont("magic")).toEqual({ font: FONTS.outline, tint: 0xeeff00 });
        expect(combatFont()).toEqual({ font: FONTS.outline, tint: 0xffffff });
        expect(combatFont("nonsense")).toEqual({ font: FONTS.outline, tint: 0xffffff });
        expect(combatFont("constructor")).toEqual({ font: FONTS.outline, tint: 0xffffff });
    });

    it("uses a baked dark-red-outline font per type for crits", () => {
        expect(combatFont("poison", true)).toEqual({
            font: "bitbybit-crit-poison",
            tint: 0xffffff,
        });
        expect(combatFont(undefined, true).font).toBe("bitbybit-crit-physical");
    });

    it("only names fonts that are baked into the atlas", () => {
        const keys = new Set(FONT_VARIANTS.map((v) => v.key));
        Object.values(FONTS).forEach((key) => expect(keys).toContain(key));
        ["physical", "magic", "burn", "bleed", "poison", "heal", "health", "level"].forEach(
            (type) => expect(keys).toContain(combatFont(type, true).font)
        );
    });
});

describe("sizes", () => {
    it("keeps font sizes on whole font pixels", () => {
        expect(pixelFontSize(2)).toBe(16);
        expect(pixelFontSize(8)).toBe(64);
    });

    it.each([
        [4, 1],
        [16, 2],
        [24, 3],
        [40, 5],
    ])("gives a %ipx banner a %ipx shadow", (size, depth) => {
        expect(bannerDepth(size)).toBe(depth);
    });
});
