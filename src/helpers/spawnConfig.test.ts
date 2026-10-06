import { describe, it, expect, vi } from "vitest";
import {
    clusterRadius,
    pickKind,
    randomInt,
    rollConfig,
    sampleInDisc,
    type SpawnConfigTuning,
} from "./spawnConfig";

// Returns each value in turn, then repeats the last.
const sequence = (...values: number[]) => {
    let i = 0;
    return () => values[Math.min(i++, values.length - 1)];
};

const TUNING: SpawnConfigTuning = {
    configWeights: { group: 70, pair: 22, pack: 8 },
    groupSize: [1, 3],
    packSize: [5, 10],
    packMixedChance: 0.7,
};

describe("randomInt", () => {
    it("covers both ends of the inclusive range", () => {
        expect(randomInt([5, 10], () => 0)).toBe(5);
        expect(randomInt([5, 10], () => 0.9999)).toBe(10);
        expect(randomInt([1, 1], () => 0.7)).toBe(1);
    });
});

describe("pickKind", () => {
    it("splits [0, 1) in proportion to the weights", () => {
        const weights = TUNING.configWeights;
        expect(pickKind(weights, () => 0)).toBe("group");
        expect(pickKind(weights, () => 0.6999)).toBe("group");
        expect(pickKind(weights, () => 0.7)).toBe("pair");
        expect(pickKind(weights, () => 0.9199)).toBe("pair");
        expect(pickKind(weights, () => 0.92)).toBe("pack");
        expect(pickKind(weights, () => 0.9999)).toBe("pack");
    });

    it("never picks a kind weighted 0", () => {
        const weights = { group: 0, pair: 1, pack: 0 };
        for (const r of [0, 0.3, 0.9999]) expect(pickKind(weights, () => r)).toBe("pair");
    });
});

describe("rollConfig", () => {
    it("draws a small group of 1-3, each member separately", () => {
        const pick = vi
            .fn()
            .mockReturnValueOnce("imp")
            .mockReturnValueOnce("ghoul")
            .mockReturnValue("satyr");

        // kind: group; size: 3.
        const config = rollConfig(TUNING, pick, sequence(0.1, 0.9999));

        expect(config).toEqual({ kind: "group", ids: ["imp", "ghoul", "satyr"] });
    });

    it("draws a pair as two of one creature", () => {
        const pick = vi.fn().mockReturnValueOnce("imp").mockReturnValue("ghoul");

        const config = rollConfig(TUNING, pick, sequence(0.8));

        expect(config).toEqual({ kind: "pair", ids: ["imp", "imp"] });
        expect(pick).toHaveBeenCalledTimes(1);
    });

    it("draws a single-species pack 30% of the time", () => {
        const pick = vi.fn().mockReturnValueOnce("slime").mockReturnValue("imp");

        // kind: pack; size: 5; mixed roll 0.7 is not below 0.7, so one species.
        const config = rollConfig(TUNING, pick, sequence(0.95, 0, 0.7));

        expect(config).toEqual({ kind: "pack", ids: Array(5).fill("slime") });
    });

    it("draws a mixed pack of 5-10 the other 70%", () => {
        let n = 0;
        const pick = vi.fn(() => `mob${n++}`);

        // kind: pack; size: 10; mixed.
        const config = rollConfig(TUNING, pick, sequence(0.95, 0.9999, 0.69));

        expect(config.kind).toBe("pack");
        expect(config.ids).toHaveLength(10);
        expect(new Set(config.ids).size).toBe(10);
    });
});

describe("clusterRadius", () => {
    it("is the base for one, growing with the square root of the head count", () => {
        expect(clusterRadius(1, 48)).toBe(48);
        expect(clusterRadius(4, 48)).toBe(96);
        expect(clusterRadius(10, 48)).toBeCloseTo(151.8, 1);
    });
});

describe("sampleInDisc", () => {
    it("stays within the radius of the centre", () => {
        const centre = { x: 100, y: -50 };
        for (const [a, b] of [
            [0, 0],
            [0.25, 0.9999],
            [0.5, 0.5],
            [0.9999, 1],
        ]) {
            const p = sampleInDisc(centre, 60, sequence(a, b));
            expect(Math.hypot(p.x - centre.x, p.y - centre.y)).toBeLessThanOrEqual(60 + 1e-9);
        }
    });

    it("reaches the edge at the top of the distance roll", () => {
        const p = sampleInDisc({ x: 0, y: 0 }, 60, sequence(0, 1));
        expect(p.x).toBeCloseTo(60);
        expect(p.y).toBeCloseTo(0);
    });
});
