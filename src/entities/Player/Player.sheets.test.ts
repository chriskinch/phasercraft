import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { HERO_ART_TOP } from "./Hero";

// The frame ranges in Player.createAnimations() are indices into whatever
// scripts/build-player-sheets.ts last baked, so nothing in the running game
// notices if a re-bake changes the row length — Phaser just plays frames that
// are not there. These assertions pin the committed sheets to the layout those
// ranges assume: 4 columns × 4 rows of 24×32 (walk-right, walk-left, idle,
// death), highest frame index 15.
const CELL_W = 24;
const CELL_H = 32;
const COLS = 4;
const ROWS = 4;

/** Highest frame index Player.createAnimations() plays (`player-death` end). */
const MAX_FRAME_INDEX = 15;

const PORTRAIT_W = 60;
const PORTRAIT_H = 90;

/** Every sheet LoadScene registers, including the `player` base texture. */
const SHEETS = ["warrior", "cleric", "mage", "occultist", "ranger", "noob"];

/** Playable classes — the sheets the bars and LEVEL+ text hang above. */
const CLASSES = SHEETS.filter((name) => name !== "noob");

/** Classes with a portrait in public/UI/player — `noob` has none. */
const PORTRAITS = CLASSES;

/** Logical screen size from a GIF header: bytes 6–9, little-endian. */
function gifSize(file: string): { width: number; height: number } {
    const buf = readFileSync(file);
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

describe("committed player spritesheets", () => {
    it.each(SHEETS)("%s.gif is a 4x4 grid of 24x32 frames", (name) => {
        const { width, height } = gifSize(
            path.join(process.cwd(), "public/graphics/spritesheets/player", `${name}.gif`)
        );

        expect({ width, height }).toEqual({ width: COLS * CELL_W, height: ROWS * CELL_H });
        expect((width / CELL_W) * (height / CELL_H)).toBeGreaterThan(MAX_FRAME_INDEX);
    });

    it.each(PORTRAITS)("%s portrait is 60x90", (name) => {
        expect(gifSize(path.join(process.cwd(), "public/UI/player", `${name}.gif`))).toEqual({
            width: PORTRAIT_W,
            height: PORTRAIT_H,
        });
    });

    // Player hangs the health/resource/shield bars off Hero.artTop(), which
    // assumes the tallest art (weapon tips included) starts at HERO_ART_TOP.
    it("HERO_ART_TOP is the topmost art row across the class sheets", async () => {
        let top = CELL_H;
        for (const name of CLASSES) {
            const file = path.join(
                process.cwd(),
                "public/graphics/spritesheets/player",
                `${name}.gif`
            );
            const { data, info } = await sharp(file)
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true });
            for (let y = 0; y < info.height; y++) {
                for (let x = 0; x < info.width; x++) {
                    if (data[(y * info.width + x) * info.channels + 3] > 0) {
                        top = Math.min(top, y % CELL_H);
                    }
                }
            }
        }
        expect(top).toBe(HERO_ART_TOP);
    });
});
