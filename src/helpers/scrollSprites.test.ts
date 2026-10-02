import { beforeAll, describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import type { SpellType } from "@entities/Spells/AssignSpell";
import { SPELL_DEFS } from "@/types/game";
import {
    ATLAS_GUTTER,
    blitCells,
    buildScrollAtlas,
    composeScrollCells,
    extractGlyph,
    GLYPH_MAX,
    GLYPH_OVERRIDES,
    hexToRgb,
    prepareGlyph,
    resolveGlyph,
    SCROLL_ART,
    SCROLL_FRAME,
    SCROLL_LEVELS,
    SCROLL_PALETTES,
    SCROLL_SIZE,
    SCROLL_SPELLS,
    scrollFrameKey,
    shrinkGlyph,
    SPELL_ICON_NAMES,
    trim,
    type FrameRect,
    type PixelGrid,
    type RGB,
    type RgbaImage,
    type ScrollAtlasJson,
} from "./scrollSprites";

const ROOT = path.resolve(__dirname, "../..");
const ATLAS_DIR = path.join(ROOT, "public/graphics/atlas");

const decode = async (file: string): Promise<RgbaImage> => {
    const { data, info } = await sharp(path.join(ATLAS_DIR, file))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    return { width: info.width, height: info.height, data: new Uint8Array(data) };
};

const iconsJson = JSON.parse(readFileSync(path.join(ATLAS_DIR, "atlas-icons.json"), "utf8")) as {
    frames: { filename: string; frame: FrameRect }[];
};
const iconFrame = (name: string): FrameRect => {
    const entry = iconsJson.frames.find((f) => f.filename === name);
    if (!entry) throw new Error(`no icon frame ${name}`);
    return entry.frame;
};

const R: RGB = [255, 0, 0];
const B: RGB = [0, 0, 255];

const cornersClear = (g: PixelGrid): boolean => {
    const h = g.length;
    const w = g[0].length;
    return !g[0][0] && !g[0][w - 1] && !g[h - 1][0] && !g[h - 1][w - 1];
};

let icons: RgbaImage;
beforeAll(async () => {
    icons = await decode("atlas-icons.png");
});

describe("scroll art", () => {
    it("is 15 × 15 and every key has a colour at every level", () => {
        expect(SCROLL_ART).toHaveLength(SCROLL_SIZE);
        for (const row of SCROLL_ART) expect(row).toHaveLength(SCROLL_SIZE);
        for (const level of SCROLL_LEVELS) {
            for (const ch of SCROLL_ART.join("").replace(/\./g, "")) {
                expect(SCROLL_PALETTES[level]).toHaveProperty(ch);
            }
        }
        expect(SCROLL_FRAME).toBe(45);
    });
});

describe("SPELL_ICON_NAMES", () => {
    it.each(SCROLL_SPELLS)("%s matches the icon_name in SPELL_DEFS", (spell) => {
        expect(SPELL_ICON_NAMES[spell]).toBe(SPELL_DEFS[spell].icon_name);
    });

    it("covers every spell class registered in AssignSpell", () => {
        const src = readFileSync(path.join(ROOT, "src/entities/Spells/AssignSpell.ts"), "utf8");
        const block = /const classes = \{([^}]*)\}/.exec(src)?.[1] ?? "";
        const names = block
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .sort();
        expect(SCROLL_SPELLS).toEqual(names);
    });
});

describe("glyph pipeline", () => {
    it("trim crops to the opaque bounding box", () => {
        expect(
            trim([
                [null, null, null],
                [null, R, null],
                [null, null, B],
            ])
        ).toEqual([
            [R, null],
            [null, B],
        ]);
        expect(trim([[null]])).toEqual([]);
    });

    it("shrinkGlyph keeps small grids and majority-samples large ones", () => {
        const small: PixelGrid = [[R, B]];
        expect(shrinkGlyph(small, 5)).toEqual(small);
        // 2 × 2 blocks: 3 red + 1 blue → red; 1 red + 3 empty → empty.
        const big: PixelGrid = [
            [R, R, R, null],
            [R, B, null, null],
        ];
        expect(shrinkGlyph(big, 2)).toEqual([[R, null]]);
    });

    it("prepareGlyph clears the four corners", () => {
        const full: PixelGrid = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => R));
        const g = prepareGlyph(full);
        expect(cornersClear(g)).toBe(true);
        expect(g[0][1]).toEqual(R);
    });

    it("extractGlyph drops the panel background and corners, reading 2 × 2 logical pixels", () => {
        // 32 × 32 frame, background grey, a 2 × 1 logical red bar at logical (6..7, 5).
        const width = 32;
        const data = new Uint8Array(width * width * 4);
        const set = (x: number, y: number, c: RGB) => data.set([...c, 255], (y * width + x) * 4);
        for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) set(x, y, [90, 90, 90]);
        for (const lx of [6, 7])
            for (let dy = 0; dy < 2; dy++)
                for (let dx = 0; dx < 2; dx++) set(lx * 2 + dx, 10 + dy, R);
        // A panel corner (logical 2,2) pixel that must be ignored.
        set(4, 4, B);
        expect(extractGlyph({ width, height: width, data }, { x: 0, y: 0, w: 32, h: 32 })).toEqual([
            [R, R],
        ]);
    });

    it.each(SCROLL_SPELLS)(
        "%s resolves to a non-empty glyph ≤ 5 × 5 with corners clear",
        (spell) => {
            const g = resolveGlyph(spell, icons, iconFrame(SPELL_ICON_NAMES[spell]));
            expect(g.length).toBeGreaterThan(0);
            expect(g.length).toBeLessThanOrEqual(GLYPH_MAX);
            for (const row of g) expect(row.length).toBeLessThanOrEqual(GLYPH_MAX);
            expect(g.flat().some(Boolean)).toBe(true);
            if (g.length > 2 && g[0].length > 2) expect(cornersClear(g)).toBe(true);
        }
    );

    it("uses the hand-drawn overrides for Consecration and Smite", () => {
        const overridden = Object.keys(GLYPH_OVERRIDES) as SpellType[];
        expect(overridden.sort()).toEqual(["Consecration", "Smite"]);
        for (const spell of overridden) {
            const override = GLYPH_OVERRIDES[spell]!;
            expect(override.rows.length).toBeLessThanOrEqual(GLYPH_MAX);
            for (const row of override.rows) {
                expect(row.length).toBe(override.rows[0].length);
                for (const ch of row.replace(/\./g, ""))
                    expect(override.colours).toHaveProperty(ch);
            }
            const g = resolveGlyph(spell, icons, iconFrame(SPELL_ICON_NAMES[spell]));
            expect(g[1].filter(Boolean)[0]).toEqual(hexToRgb(Object.values(override.colours)[0]));
        }
    });
});

describe("composition", () => {
    it("rings the glyph in the level's outline colour, centred on the page", () => {
        const cells = composeScrollCells([[R]], 2);
        const outline = hexToRgb(SCROLL_PALETTES[2].O);
        // Page rows 4..10, centre column 7: a 1 × 1 glyph lands at (7, 7).
        expect(cells[7][7]).toEqual(R);
        for (const [x, y] of [
            [6, 7],
            [8, 7],
            [7, 6],
            [7, 8],
        ]) {
            expect(cells[y][x]).toEqual(outline);
        }
        expect(cells[0][0]).toBeNull();
    });

    it("blitCells scales each cell to scale × scale opaque pixels", () => {
        const target: RgbaImage = { width: 4, height: 2, data: new Uint8Array(32) };
        blitCells(target, [[null, B]], 0, 0, 2);
        expect([...target.data.slice(0, 4)]).toEqual([0, 0, 0, 0]);
        expect([...target.data.slice(8, 12)]).toEqual([0, 0, 255, 255]);
        expect([...target.data.slice(28, 32)]).toEqual([0, 0, 255, 255]);
    });

    it("builds a deterministic atlas", () => {
        const a = buildScrollAtlas(icons, iconFrame);
        const b = buildScrollAtlas(icons, iconFrame);
        expect(Buffer.from(a.image.data).equals(Buffer.from(b.image.data))).toBe(true);
        expect(a.json).toEqual(b.json);
        expect(createHash("sha256").update(a.image.data).digest("hex")).toMatchInlineSnapshot(
            `"525358674889b8cafd412545dd8da74503aecd54805092af8ece715bc46d311c"`
        );
    });
});

describe("committed atlas (public/graphics/atlas/scrolls.*)", () => {
    const committed = JSON.parse(
        readFileSync(path.join(ATLAS_DIR, "scrolls.json"), "utf8")
    ) as ScrollAtlasJson;

    it("has a 45 × 45 frame for every spell × level", () => {
        for (const spell of SCROLL_SPELLS) {
            for (const level of SCROLL_LEVELS) {
                const f = committed.frames[scrollFrameKey(spell, level)];
                expect(f, scrollFrameKey(spell, level)).toBeDefined();
                expect(f.frame.w).toBe(SCROLL_FRAME);
                expect(f.frame.h).toBe(SCROLL_FRAME);
            }
        }
        expect(Object.keys(committed.frames)).toHaveLength(
            SCROLL_SPELLS.length * SCROLL_LEVELS.length
        );
        expect(ATLAS_GUTTER).toBeGreaterThan(0);
    });

    it("is up to date with the generator (run `npm run scrolls:build`)", async () => {
        const built = buildScrollAtlas(icons, iconFrame);
        expect(committed).toEqual(built.json);
        const png = await decode("scrolls.png");
        expect([png.width, png.height]).toEqual([built.image.width, built.image.height]);
        expect(Buffer.from(png.data).equals(Buffer.from(built.image.data))).toBe(true);
    });
});
