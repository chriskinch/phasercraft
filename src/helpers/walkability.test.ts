import { describe, it, expect } from "vitest";
import { buildWalkability, isFootprintSpawnable, type WalkabilityGrid } from "./walkability";

// Maps are drawn as rows of characters: "." pure land, "~" water (shoreline,
// walkable), "#" solid (full water or a tree base), "S" the player's start on
// land. Tiles are 10px square to keep the footprint arithmetic readable.
function grid(rows: string[]): WalkabilityGrid {
    const height = rows.length;
    const width = rows[0].length;
    const cells = rows.join("").split("");
    const s = cells.indexOf("S");
    return buildWalkability({
        width,
        height,
        tileWidth: 10,
        tileHeight: 10,
        water: cells.map((c) => c === "~"),
        solid: cells.map((c) => c === "#"),
        start: { x: s % width, y: Math.floor(s / width) },
    });
}

// Renders the spawnable mask back as rows: "o" spawnable, "." not.
const mask = (g: WalkabilityGrid) =>
    Array.from({ length: g.height }, (_, y) =>
        Array.from({ length: g.width }, (_, x) => (g.spawnable[y * g.width + x] ? "o" : ".")).join(
            ""
        )
    );

describe("buildWalkability", () => {
    it("marks reachable land spawnable, including the start", () => {
        expect(mask(grid(["S..", "...", "..."]))).toEqual(["ooo", "ooo", "ooo"]);
    });

    it("rejects solid tiles", () => {
        expect(mask(grid(["S#.", "...", "..."]))).toEqual(["o.o", "ooo", "ooo"]);
    });

    it("rejects shoreline water but floods through it", () => {
        // The shoreline column is walkable, so the land beyond it is reached,
        // but no enemy may spawn on the shoreline itself.
        expect(mask(grid(["S~.", ".~.", ".~."]))).toEqual(["o.o", "o.o", "o.o"]);
    });

    it("never reaches an island across solid water", () => {
        expect(mask(grid(["S.#..", "..#..", "..#.."]))).toEqual(["oo...", "oo...", "oo..."]);
    });

    it("never reaches a pocket walled in by solid tiles", () => {
        expect(mask(grid(["S....", ".###.", ".#.#.", ".###.", "....."]))).toEqual([
            "ooooo",
            "o...o",
            "o...o",
            "o...o",
            "ooooo",
        ]);
    });

    it("treats a diagonal gap between solids as sealed", () => {
        expect(mask(grid(["S#.", "#..", "..."]))).toEqual(["o..", "...", "..."]);
    });

    it("spawns nowhere when the start is solid or off the map", () => {
        const base = {
            width: 2,
            height: 1,
            tileWidth: 10,
            tileHeight: 10,
            water: [false, false],
        };
        const solidStart = buildWalkability({
            ...base,
            solid: [true, false],
            start: { x: 0, y: 0 },
        });
        expect([...solidStart.spawnable]).toEqual([0, 0]);

        const offMap = buildWalkability({ ...base, solid: [false, false], start: { x: 5, y: 0 } });
        expect([...offMap.spawnable]).toEqual([0, 0]);
    });
});

describe("isFootprintSpawnable", () => {
    const g = grid(["S...", "..#.", "....", "~..."]);

    it("accepts a rect inside one spawnable tile", () => {
        expect(isFootprintSpawnable(g, { x: 1, y: 1, width: 8, height: 8 })).toBe(true);
    });

    it("checks every tile a rect spans", () => {
        // Spans tiles (0,0)-(1,1): all land.
        expect(isFootprintSpawnable(g, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
        // Spans (1,0)-(2,1): clips the solid tile at (2,1).
        expect(isFootprintSpawnable(g, { x: 15, y: 5, width: 10, height: 10 })).toBe(false);
        // Spans (0,2)-(1,3): clips the shoreline at (0,3).
        expect(isFootprintSpawnable(g, { x: 5, y: 25, width: 10, height: 10 })).toBe(false);
    });

    it("does not count a tile the rect only touches on its far edge", () => {
        // Ends exactly on x = 20, the boundary of the solid column.
        expect(isFootprintSpawnable(g, { x: 10, y: 10, width: 10, height: 10 })).toBe(true);
    });

    it("rejects a zero-size rect rather than passing it unchecked", () => {
        expect(isFootprintSpawnable(g, { x: 10, y: 10, width: 0, height: 10 })).toBe(false);
        expect(isFootprintSpawnable(g, { x: 10, y: 10, width: 10, height: 0 })).toBe(false);
    });

    it("rejects rects reaching past any map edge", () => {
        expect(isFootprintSpawnable(g, { x: -1, y: 0, width: 8, height: 8 })).toBe(false);
        expect(isFootprintSpawnable(g, { x: 0, y: -1, width: 8, height: 8 })).toBe(false);
        expect(isFootprintSpawnable(g, { x: 35, y: 0, width: 8, height: 8 })).toBe(false);
        expect(isFootprintSpawnable(g, { x: 0, y: 35, width: 8, height: 8 })).toBe(false);
    });
});
