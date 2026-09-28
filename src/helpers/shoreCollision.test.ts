import { describe, it, expect } from "vitest";
import { NE, NW, SE, SW, shoreCells } from "./shoreCollision";

describe("shoreCells", () => {
    it("leaves land and unmasked tiles open", () => {
        expect(shoreCells(2, 1, [0, undefined])).toEqual(new Array(8).fill(false));
    });

    it("maps each corner bit to its quadrant", () => {
        // 1x1 map -> 2x2 cells: [NW, NE, SW, SE]
        expect(shoreCells(1, 1, [NW])).toEqual([true, false, false, false]);
        expect(shoreCells(1, 1, [NE])).toEqual([false, true, false, false]);
        expect(shoreCells(1, 1, [SW])).toEqual([false, false, true, false]);
        expect(shoreCells(1, 1, [SE])).toEqual([false, false, false, true]);
        expect(shoreCells(1, 1, [NW | NE])).toEqual([true, true, false, false]);
    });

    it("places quadrants at the tile's offset in the half-tile grid", () => {
        // 2x2 map -> 4x4 cells; SE water on tile (1,1) is cell (3,3).
        const cells = shoreCells(2, 2, [0, 0, 0, SE]);
        expect(cells.flatMap((solid, i) => (solid ? [i] : []))).toEqual([15]);
        // NW|SW on tile (1,0) is cells (2,0) and (2,1).
        const west = shoreCells(2, 2, [0, NW | SW, 0, 0]);
        expect(west.flatMap((solid, i) => (solid ? [i] : []))).toEqual([2, 6]);
    });
});
