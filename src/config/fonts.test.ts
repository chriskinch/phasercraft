import { describe, it, expect } from "vitest";
import { bannerStyle, FONT_FAMILY } from "./fonts";

describe("bannerStyle", () => {
    it("uses the BoldPixels family at the requested pixel size", () => {
        expect(FONT_FAMILY).toBe("BoldPixels");
        expect(bannerStyle(32)).toMatchObject({ fontFamily: "BoldPixels", fontSize: "32px" });
    });

    it.each([
        [16, 2, 1],
        [32, 4, 2],
        [64, 8, 4],
    ])("scales stroke and shadow depth with size %i", (size, stroke, depth) => {
        const style = bannerStyle(size);
        expect(style.strokeThickness).toBe(stroke);
        expect(style.shadow).toMatchObject({ offsetX: depth, offsetY: depth, blur: 0 });
    });

    it("clamps stroke to 2px and shadow to 1px at small sizes", () => {
        const style = bannerStyle(4);
        expect(style.strokeThickness).toBe(2);
        expect(style.shadow).toMatchObject({ offsetX: 1, offsetY: 1 });
    });
});
