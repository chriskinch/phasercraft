import { describe, it, expect } from "vitest";
import { mulberry32 } from "./rng";
import { nearestIndex, ringPlacements } from "./placement";

const base = {
    centre: { x: 500, y: 500 },
    minRadius: 90,
    maxRadius: 230,
    size: { width: 20, height: 20 },
};

describe("ringPlacements", () => {
    it("places the requested count inside the annulus without overlaps", () => {
        const points = ringPlacements({
            ...base,
            count: 30,
            random: mulberry32(1),
            accept: () => true,
        });
        expect(points).toHaveLength(30);
        points.forEach((point) => {
            const distance = Math.hypot(point.x - 500, point.y - 500);
            expect(distance).toBeGreaterThanOrEqual(90);
            expect(distance).toBeLessThanOrEqual(230);
        });
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const apart =
                    Math.abs(points[i].x - points[j].x) >= 20 ||
                    Math.abs(points[i].y - points[j].y) >= 20;
                expect(apart).toBe(true);
            }
        }
    });

    it("is deterministic for a seed", () => {
        const make = () =>
            ringPlacements({ ...base, count: 10, random: mulberry32(9), accept: () => true });
        expect(make()).toEqual(make());
    });

    it("only keeps accepted footprints, centred on the point", () => {
        const points = ringPlacements({
            ...base,
            count: 10,
            random: mulberry32(3),
            // Open land only to the right of the player.
            accept: (rect) => rect.x > 500,
        });
        expect(points.length).toBeGreaterThan(0);
        points.forEach((point) => expect(point.x - 10).toBeGreaterThan(500));
    });

    it("gives up after the attempt budget", () => {
        const points = ringPlacements({
            ...base,
            count: 5,
            random: mulberry32(3),
            accept: () => false,
            maxAttempts: 10,
        });
        expect(points).toEqual([]);
    });
});

describe("nearestIndex", () => {
    it("finds the closest point, first on ties", () => {
        const from = { x: 0, y: 0 };
        expect(nearestIndex(from, [])).toBe(-1);
        expect(
            nearestIndex(from, [
                { x: 5, y: 5 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
            ])
        ).toBe(1);
    });
});
