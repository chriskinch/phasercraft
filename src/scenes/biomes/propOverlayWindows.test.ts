import { describe, it, expect } from "vitest";
import { OverlayWindows, WINDOW_SIZE, cullBounds, withinBounds } from "./propOverlayWindows";

describe("cullBounds", () => {
    const out = () => ({ left: 0, top: 0, right: 0, bottom: 0 });

    it("covers both the last view and the next one, plus the margins", () => {
        const last = { x: 0, y: 0, width: 800, height: 600 };
        const next = { x: 100, y: -50, width: 800, height: 600 };

        expect(cullBounds(out(), last, next, 10, 20)).toEqual({
            left: -10,
            top: -70,
            right: 910,
            bottom: 620,
        });
    });

    it("still covers the next view when the last one never rendered", () => {
        // A camera that has not rendered yet has an empty view at the origin.
        const last = { x: 0, y: 0, width: 0, height: 0 };
        const next = { x: 4000, y: 3000, width: 800, height: 600 };

        const bounds = cullBounds(out(), last, next, 0, 0);

        expect(withinBounds(bounds, 4000, 3000)).toBe(true);
        expect(withinBounds(bounds, 4800, 3600)).toBe(true);
    });

    it("writes into the box it is given", () => {
        const box = out();
        const view = { x: 0, y: 0, width: 1, height: 1 };
        expect(cullBounds(box, view, view, 0, 0)).toBe(box);
    });
});

describe("withinBounds", () => {
    const bounds = { left: 0, top: 0, right: 100, bottom: 50 };

    it.each([
        [0, 0, true],
        [100, 50, true],
        [50, 25, true],
        [-1, 25, false],
        [101, 25, false],
        [50, -1, false],
        [50, 51, false],
    ])("(%d, %d) inside: %s", (x, y, inside) => {
        expect(withinBounds(bounds, x, y)).toBe(inside);
    });
});

describe("OverlayWindows", () => {
    const a = { id: "a" };
    const b = { id: "b" };
    const window = (start: number) => Array.from({ length: WINDOW_SIZE }, (_, i) => start + i);

    function record(windows: OverlayWindows<object>, frame: Array<[object, number]>) {
        windows.begin();
        for (const [character, start] of frame) {
            windows.characters.push(character);
            windows.cells.push(...window(start));
        }
    }

    it("has changed until something is drawn", () => {
        const windows = new OverlayWindows<object>();
        record(windows, []);
        expect(windows.changed()).toBe(true);
    });

    it("is unchanged when the same characters cover the same cells", () => {
        const windows = new OverlayWindows<object>();
        record(windows, [
            [a, 10],
            [b, 20],
        ]);
        windows.commit();

        record(windows, [
            [a, 10],
            [b, 20],
        ]);
        expect(windows.changed()).toBe(false);
    });

    it("has changed when any cell differs", () => {
        const windows = new OverlayWindows<object>();
        record(windows, [[a, 10]]);
        windows.commit();

        record(windows, [[a, 11]]);
        expect(windows.changed()).toBe(true);
    });

    it("has changed when a character joins, leaves or swaps places", () => {
        const windows = new OverlayWindows<object>();
        const drawn: Array<[object, number]> = [
            [a, 10],
            [b, 10],
        ];
        record(windows, drawn);
        windows.commit();

        record(windows, [...drawn, [{ id: "c" }, 10]]);
        expect(windows.changed()).toBe(true);
        record(windows, [[a, 10]]);
        expect(windows.changed()).toBe(true);
        // Draw order decides which pool sprite takes which tile.
        record(windows, [
            [b, 10],
            [a, 10],
        ]);
        expect(windows.changed()).toBe(true);
    });

    it("compares against the last drawn frame, not the last recorded one", () => {
        const windows = new OverlayWindows<object>();
        record(windows, [[a, 10]]);
        windows.commit();

        // Recorded but not drawn (a skipped frame would not get here; this
        // checks commit is what moves the baseline).
        record(windows, [[a, 11]]);
        record(windows, [[a, 10]]);
        expect(windows.changed()).toBe(false);
    });

    it("has changed after invalidate, and lets go of its characters", () => {
        const windows = new OverlayWindows<object>();
        record(windows, [[a, 10]]);
        windows.commit();
        record(windows, [[a, 10]]);

        windows.invalidate();

        expect(windows.characters).toEqual([]);
        record(windows, [[a, 10]]);
        expect(windows.changed()).toBe(true);
    });
});
