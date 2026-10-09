import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { HERO_SCALE } from "./Hero";
import { PLAYER_OVERHEAD_Y } from "./Player";

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

    // The resource bar is the lowest overhead bar; it must clear the tallest
    // art in any frame of any class (weapon tips, the cleric's hat). Positions
    // are container-relative: the sprite is centred on the origin at
    // HERO_SCALE, and the bars hang off the enemy collider's top, one unscaled
    // frame above the scaled feet (Hero.colliderTop()).
    it("the resource bar clears the tallest class art", async () => {
        let topRow = CELL_H;
        for (const name of PORTRAITS) {
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
                        topRow = Math.min(topRow, y % CELL_H);
                    }
                }
            }
        }
        const displayHeight = CELL_H * HERO_SCALE;
        const artTop = -displayHeight / 2 + topRow * HERO_SCALE;

        // PNG IHDR: height is the big-endian uint32 at byte 20.
        const barHeight = readFileSync(
            path.join(process.cwd(), "public/graphics/images/resource-frame.png")
        ).readUInt32BE(20);
        const colliderTop = displayHeight / 2 - CELL_H;
        const barBottom = colliderTop + PLAYER_OVERHEAD_Y.resource + barHeight;

        expect(barBottom).toBeLessThanOrEqual(artTop);
    });
});
