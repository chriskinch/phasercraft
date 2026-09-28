import { describe, it, expect } from "vitest";
import {
    NE,
    NW,
    SE,
    SW,
    SHORE_CELL,
    SHORE_EDGE,
    SHORE_OFFSET,
    isShoreBlocked,
    shoreGrid,
} from "./shoreCollision";

describe("isShoreBlocked", () => {
    it("never blocks land", () => {
        expect(isShoreBlocked(0, 0, 0)).toBe(false);
    });

    it("pulls each straight edge in to where the grass starts", () => {
        // Water north: blocked above the lip, open from it.
        expect(isShoreBlocked(NW | NE, 8, SHORE_EDGE.waterNorth - 1)).toBe(true);
        expect(isShoreBlocked(NW | NE, 8, SHORE_EDGE.waterNorth)).toBe(false);
        // Water south: the cliff face is blocked.
        expect(isShoreBlocked(SW | SE, 8, SHORE_EDGE.waterSouth - 1)).toBe(false);
        expect(isShoreBlocked(SW | SE, 8, SHORE_EDGE.waterSouth)).toBe(true);
        // Water west / east.
        expect(isShoreBlocked(NW | SW, SHORE_EDGE.waterWest - 1, 8)).toBe(true);
        expect(isShoreBlocked(NW | SW, SHORE_EDGE.waterWest, 8)).toBe(false);
        expect(isShoreBlocked(NE | SE, SHORE_EDGE.waterEast - 1, 8)).toBe(false);
        expect(isShoreBlocked(NE | SE, SHORE_EDGE.waterEast, 8)).toBe(true);
    });

    it("uses the same edges for corners", () => {
        // Outer corner, water SE only: blocked right of the east edge and below the south edge.
        expect(isShoreBlocked(SE, SHORE_EDGE.waterEast, SHORE_EDGE.waterSouth)).toBe(true);
        expect(isShoreBlocked(SE, SHORE_EDGE.waterEast - 1, 15)).toBe(false);
        expect(isShoreBlocked(SE, 15, SHORE_EDGE.waterSouth - 1)).toBe(false);
        // Inner corner, land SE only: open only past both the west and north edges.
        const land_se = NW | NE | SW;
        expect(isShoreBlocked(land_se, SHORE_EDGE.waterWest, SHORE_EDGE.waterNorth)).toBe(false);
        expect(isShoreBlocked(land_se, SHORE_EDGE.waterWest - 1, 15)).toBe(true);
        expect(isShoreBlocked(land_se, 15, SHORE_EDGE.waterNorth - 1)).toBe(true);
    });
});

describe("shoreGrid", () => {
    // Blocked state of the grid at art pixel (px, py).
    const gridAt = (grid: ReturnType<typeof shoreGrid>, px: number, py: number) => {
        const cx = Math.floor((px + SHORE_OFFSET) / SHORE_CELL);
        const cy = Math.floor((py + SHORE_OFFSET) / SHORE_CELL);
        return grid.cells[cy * grid.cols + cx];
    };

    it("is a half-tile grid with one extra cell per axis for the offset", () => {
        const grid = shoreGrid(3, 2, []);
        expect([grid.cols, grid.rows]).toEqual([7, 5]);
        expect(grid.cells.every((cell) => !cell)).toBe(true);
    });

    it("matches isShoreBlocked pixel for pixel on every shoreline tile", () => {
        // Every shoreline mask the generator emits (the diagonals NW|SE and
        // NE|SW have no tile in the sheet).
        for (const mask of [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14]) {
            // The shoreline tile in the middle of a 3x3 map. (Its blocked area
            // spills a quarter tile into the neighbour on the water side, which
            // in a real map is water anyway, so only the tile itself is checked.)
            const masks = [0, 0, 0, 0, mask, 0, 0, 0, 0];
            const grid = shoreGrid(3, 3, masks);
            for (let py = 0; py < 16; py++) {
                for (let px = 0; px < 16; px++) {
                    expect(gridAt(grid, px + 16, py + 16), `mask ${mask} at ${px},${py}`).toBe(
                        isShoreBlocked(mask, px, py)
                    );
                }
            }
        }
    });

    it("keeps a straight shore continuous across tiles", () => {
        const grid = shoreGrid(2, 1, [NW | NE, NW | NE]);
        for (let px = 0; px < 32; px++) {
            expect(gridAt(grid, px, SHORE_EDGE.waterNorth - 1)).toBe(true);
            expect(gridAt(grid, px, SHORE_EDGE.waterNorth)).toBe(false);
        }
    });
});
