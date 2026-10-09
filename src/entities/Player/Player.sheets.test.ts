import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

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

/** Classes with a portrait in public/UI/player — `noob` has none. */
const PORTRAITS = SHEETS.filter((name) => name !== "noob");

/** Logical screen size from a GIF header: bytes 6–9, little-endian. */
function gifSize(file: string): { width: number; height: number } {
    const buf = readFileSync(file);
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

describe("committed player spritesheets", () => {
    it.each(SHEETS)("%s.gif is a %ix%i grid of 24x32 frames", (name) => {
        const { width, height } = gifSize(
            path.join(process.cwd(), "public/graphics/spritesheets/player", `${name}.gif`)
        );

        expect({ width, height }).toEqual({ width: COLS * CELL_W, height: ROWS * CELL_H });
        expect((width / CELL_W) * (height / CELL_H)).toBeGreaterThan(MAX_FRAME_INDEX);
    });

    it.each(PORTRAITS)("%s portrait is %ix%i", (name) => {
        expect(gifSize(path.join(process.cwd(), "public/UI/player", `${name}.gif`))).toEqual({
            width: PORTRAIT_W,
            height: PORTRAIT_H,
        });
    });
});
