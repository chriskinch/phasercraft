import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { FONT_ATLAS, FONT_VARIANTS } from "@config/fonts";
import { BITBYBIT_GLYPHS } from "./bitbybitGlyphs";
import { buildPixelFont, FONT_SIZE, outlineMask, type GlyphSource } from "./buildFont";

const FONT_DIR = path.resolve(__dirname, "../../../public/graphics/fonts");

const grid = (...rows: string[]) => rows.map((row) => [...row].map((c) => c === "#"));
const show = (mask: boolean[][]) => mask.map((row) => row.map((on) => (on ? "o" : ".")).join(""));

const pixel = (
    { width, data }: { width: number; data: Uint8Array },
    x: number,
    y: number
): number[] => [...data.slice((y * width + x) * 4, (y * width + x) * 4 + 4)];

const chars = (xml: string) =>
    new Map(
        [...xml.matchAll(/<char id="(\d+)" ([^/]*)\/>/g)].map(([, id, attrs]) => [
            Number(id),
            Object.fromEntries(
                [...attrs.matchAll(/(\w+)="(-?\d+)"/g)].map(([, k, v]) => [k, Number(v)])
            ),
        ])
    );

describe("outlineMask", () => {
    it("rings a pixel on all eight sides", () => {
        expect(show(outlineMask(grid("#")))).toEqual(["ooo", "o.o", "ooo"]);
    });

    it("fills holes and gaps that touch ink, like the pack's Outlined sheet", () => {
        // 'a' from the pack: the gap in its bowl becomes outline.
        expect(show(outlineMask(grid(".###", "##.#", "####")))).toEqual([
            ".ooooo",
            "oo...o",
            "o..o.o",
            "o....o",
            "oooooo",
        ]);
    });
});

describe("buildPixelFont", () => {
    const glyphs: Record<string, GlyphSource> = {
        " ": [0, ".."],
        A: [4, "##", "##", "##", "##"],
        g: [3, "##", "##", "##", "##"],
    };
    const variants = [
        { key: "plain", fill: 0xffffff },
        { key: "red", fill: 0xff0000, outline: 0x000080 },
    ];
    const build = buildPixelFont(glyphs, variants, { width: 16 });

    it("lays out plain glyphs with 1px letter spacing on a 5-row ascent", () => {
        const plain = chars(build.xml.plain);
        expect(build.xml.plain).toContain(`size="${FONT_SIZE}"`);
        expect(build.xml.plain).toContain(`lineHeight="6" base="5"`);
        expect(plain.get(65)).toMatchObject({ width: 2, height: 4, yoffset: 1, xadvance: 3 });
        // Descender: top 3, so it starts lower and runs a row past the baseline.
        expect(plain.get(103)).toMatchObject({ yoffset: 2 });
        // Space has no ink: no cell, advance only.
        expect(plain.get(32)).toMatchObject({ width: 0, height: 0, xadvance: 3 });
    });

    it("pads outlined glyphs by a pixel, a column apart", () => {
        const outlined = chars(build.xml.outlined);
        expect(build.xml.outlined).toContain(`lineHeight="8" base="6"`);
        expect(outlined.get(65)).toMatchObject({ width: 4, height: 6, yoffset: 1, xadvance: 5 });
    });

    it("stacks one atlas frame per variant", () => {
        const { plain, red } = build.atlas.frames;
        expect(plain.frame).toEqual({ x: 0, y: 0, w: 16, h: 4 });
        expect(red.frame).toEqual({ x: 0, y: 5, w: 16, h: 6 });
        expect([build.image.width, build.image.height]).toEqual([16, 11]);
    });

    it("bakes each variant's fill and outline colours", () => {
        const outlinedA = chars(build.xml.outlined).get(65)!;
        const top = build.atlas.frames.red.frame.y + outlinedA.y;
        expect(pixel(build.image, outlinedA.x, top)).toEqual([0, 0, 0x80, 255]);
        expect(pixel(build.image, outlinedA.x + 1, top + 1)).toEqual([255, 0, 0, 255]);
        expect(pixel(build.image, 0, 0)).toEqual([255, 255, 255, 255]);
    });

    it("rejects ragged rows and duplicate variant keys", () => {
        expect(() => buildPixelFont({ A: [4, "##", "#"] }, variants)).toThrow(/rows must be/);
        expect(() => buildPixelFont(glyphs, [variants[0], variants[0]])).toThrow(/duplicate/);
    });
});

describe("bitByBit glyphs", () => {
    it("cover printable ASCII", () => {
        const missing = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).filter(
            (char) => !(char in BITBYBIT_GLYPHS)
        );
        expect(missing).toEqual([]);
    });

    it("stay within the 5-row ascent and 1-row descent", () => {
        Object.entries(BITBYBIT_GLYPHS).forEach(([char, [top, ...rows]]) => {
            expect(top, char).toBeLessThanOrEqual(5);
            expect(rows.length - top, char).toBeLessThanOrEqual(1);
        });
    });
});

describe(`committed font (public/graphics/fonts/${FONT_ATLAS}.*)`, () => {
    it("is up to date with the generator (run `npm run fonts:build`)", async () => {
        const built = buildPixelFont(BITBYBIT_GLYPHS, FONT_VARIANTS, {
            image: `${FONT_ATLAS}.png`,
        });
        const read = (file: string) => readFileSync(path.join(FONT_DIR, file), "utf8");
        expect(JSON.parse(read(`${FONT_ATLAS}.json`))).toEqual(built.atlas);
        expect(read(`${FONT_ATLAS}-plain.xml`)).toBe(built.xml.plain);
        expect(read(`${FONT_ATLAS}-outlined.xml`)).toBe(built.xml.outlined);
        const { data, info } = await sharp(path.join(FONT_DIR, `${FONT_ATLAS}.png`))
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        expect([info.width, info.height]).toEqual([built.image.width, built.image.height]);
        expect(Buffer.from(data).equals(Buffer.from(built.image.data))).toBe(true);
    });
});
