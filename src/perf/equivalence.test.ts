import { describe, it, expect } from "vitest";
import { compareExact, compareTolerance } from "./equivalence";
import type { ReplayCheckpoint } from "./types";

const aggregates = { kills: 10, damageTaken: 1000, attacks: 50 };
const golden: ReplayCheckpoint[] = [
    { tick: 300, hash: "aaaaaaaa", aggregates },
    { tick: 600, hash: "bbbbbbbb", aggregates },
];

describe("compareExact", () => {
    it("passes identical checkpoints", () => {
        expect(compareExact(golden, golden)).toEqual([]);
    });

    it("names each diverging tick", () => {
        const actual = [golden[0], { ...golden[1], hash: "cccccccc" }];
        expect(compareExact(golden, actual)).toEqual(["tick 600: hash cccccccc, golden bbbbbbbb"]);
    });

    it("flags missing or shifted checkpoints", () => {
        expect(compareExact(golden, [golden[0]])).toEqual(["checkpoint count 1, golden 2"]);
        expect(compareExact(golden, [golden[0], { ...golden[1], tick: 900 }])).toEqual([
            "checkpoint 1: tick 900, golden 600",
        ]);
    });
});

describe("compareTolerance", () => {
    it("passes outcomes inside the band, edges included", () => {
        expect(
            compareTolerance(aggregates, { kills: 11, damageTaken: 900, attacks: 50 }, 0.1)
        ).toEqual([]);
    });

    it("flags each outcome outside the band", () => {
        expect(
            compareTolerance(aggregates, { kills: 12, damageTaken: 1000, attacks: 40 }, 0.1)
        ).toEqual(["kills: 12, golden 10 (±10%)", "attacks: 40, golden 50 (±10%)"]);
    });

    it("requires an exact match for a zero golden", () => {
        expect(compareTolerance({ ...aggregates, kills: 0 }, aggregates, 0.1)).toEqual([
            "kills: 10, golden 0 (±10%)",
        ]);
    });
});
