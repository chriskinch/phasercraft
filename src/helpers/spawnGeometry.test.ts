import { describe, it, expect } from "vitest";
import { isBeyondRadius, sampleSpawnPoint, spawnDirection, spawnRadius } from "./spawnGeometry";

const view = { viewWidth: 800, viewHeight: 600, zoom: 1, margin: 64, override: 0 };

describe("spawnRadius", () => {
    it("is half the viewport diagonal plus the margin", () => {
        // 800x600 has a 1000px diagonal.
        expect(spawnRadius(view)).toBe(500 + 64);
    });

    it("converts the view to world px by the camera zoom", () => {
        expect(spawnRadius({ ...view, zoom: 2 })).toBe(250 + 64);
    });

    it("uses a positive override as-is, ignoring the view", () => {
        expect(spawnRadius({ ...view, override: 200 })).toBe(200);
    });

    it("treats a zero or negative override as auto", () => {
        expect(spawnRadius({ ...view, override: 0 })).toBe(564);
        expect(spawnRadius({ ...view, override: -5 })).toBe(564);
    });
});

describe("spawnDirection", () => {
    it("normalises the velocity", () => {
        const dir = spawnDirection({ x: 30, y: 40 }, 10);
        expect(dir?.x).toBeCloseTo(0.6);
        expect(dir?.y).toBeCloseTo(0.8);
    });

    it("is null below the moving speed", () => {
        expect(spawnDirection({ x: 3, y: 4 }, 10)).toBeNull();
    });

    it("is null when stationary, even with no threshold", () => {
        expect(spawnDirection({ x: 0, y: 0 }, 0)).toBeNull();
    });

    it("counts exactly the moving speed as moving", () => {
        expect(spawnDirection({ x: 10, y: 0 }, 10)).toEqual({ x: 1, y: 0 });
    });
});

describe("sampleSpawnPoint", () => {
    const origin = { x: 100, y: 200 };
    const halfAngle = Math.PI / 4;
    const angleOf = (p: { x: number; y: number }) => Math.atan2(p.y - origin.y, p.x - origin.x);

    it("always lands exactly on the radius", () => {
        for (const r of [0, 0.25, 0.5, 0.999]) {
            const p = sampleSpawnPoint(origin, 300, { x: 0, y: -1 }, halfAngle, () => r);
            expect(Math.hypot(p.x - origin.x, p.y - origin.y)).toBeCloseTo(300);
        }
    });

    it("centres the cone on the direction of travel", () => {
        const p = sampleSpawnPoint(origin, 300, { x: 1, y: 0 }, halfAngle, () => 0.5);
        expect(p.x).toBeCloseTo(400);
        expect(p.y).toBeCloseTo(200);
    });

    it("spans the cone edges at the ends of the random range", () => {
        const low = sampleSpawnPoint(origin, 300, { x: 1, y: 0 }, halfAngle, () => 0);
        const high = sampleSpawnPoint(origin, 300, { x: 1, y: 0 }, halfAngle, () => 1);
        expect(angleOf(low)).toBeCloseTo(-halfAngle);
        expect(angleOf(high)).toBeCloseTo(halfAngle);
    });

    it("never leaves the cone", () => {
        const direction = { x: -Math.SQRT1_2, y: Math.SQRT1_2 }; // down-left
        const centre = Math.atan2(direction.y, direction.x);
        for (let i = 0; i < 200; i++) {
            const p = sampleSpawnPoint(origin, 300, direction, halfAngle);
            // Wrap the difference into (-π, π] before comparing.
            const diff = Math.atan2(Math.sin(angleOf(p) - centre), Math.cos(angleOf(p) - centre));
            expect(Math.abs(diff)).toBeLessThanOrEqual(halfAngle + 1e-9);
        }
    });

    it("uses the full circle when there is no direction", () => {
        // A quarter of the way round the ring is straight down (+y).
        const p = sampleSpawnPoint(origin, 300, null, halfAngle, () => 0.25);
        expect(p.x).toBeCloseTo(100);
        expect(p.y).toBeCloseTo(500);

        // Behind a cone that would point right: unreachable with a direction.
        const behind = sampleSpawnPoint(origin, 300, null, halfAngle, () => 0.5);
        expect(behind.x).toBeCloseTo(-200);
    });
});

describe("isBeyondRadius", () => {
    const a = { x: 0, y: 0 };

    it("is false inside and exactly on the radius", () => {
        expect(isBeyondRadius(a, { x: 3, y: 4 }, 10)).toBe(false);
        expect(isBeyondRadius(a, { x: 6, y: 8 }, 10)).toBe(false);
    });

    it("is true strictly beyond the radius", () => {
        expect(isBeyondRadius(a, { x: 6, y: 8.01 }, 10)).toBe(true);
    });
});
