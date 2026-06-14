import { describe, it, expect } from "vitest";
import {
    sortAscending,
    sortDescending,
    sortBy,
    statsArrayToObject,
    addStats,
    removeStats,
} from "./helpers";

// Pure sort/shape helpers used by the inventory/loot UI. These pin the
// comparator semantics (the `>`/`<` based ordering), the non-mutating
// `sortBy`, and the array->object reduction.

describe("sortAscending", () => {
    it("returns 1/-1/0 mirroring `>`/`<` on the keyed value", () => {
        const cmp = sortAscending("v");
        expect(cmp({ v: 2 }, { v: 1 })).toBe(1);
        expect(cmp({ v: 1 }, { v: 2 })).toBe(-1);
        expect(cmp({ v: 1 }, { v: 1 })).toBe(0);
    });

    it("orders an array ascending when used with Array.sort", () => {
        const arr = [{ v: 3 }, { v: 1 }, { v: 2 }];
        expect(arr.sort(sortAscending("v"))).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }]);
    });

    it("compares string-valued keys lexicographically", () => {
        const cmp = sortAscending("name");
        expect(cmp({ name: "b" }, { name: "a" })).toBe(1);
        expect(cmp({ name: "a" }, { name: "b" })).toBe(-1);
    });
});

describe("sortDescending", () => {
    it("returns 1/-1/0 as the inverse of ascending", () => {
        const cmp = sortDescending("v");
        expect(cmp({ v: 1 }, { v: 2 })).toBe(1);
        expect(cmp({ v: 2 }, { v: 1 })).toBe(-1);
        expect(cmp({ v: 1 }, { v: 1 })).toBe(0);
    });

    it("orders an array descending when used with Array.sort", () => {
        const arr = [{ v: 1 }, { v: 3 }, { v: 2 }];
        expect(arr.sort(sortDescending("v"))).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }]);
    });
});

describe("sortBy", () => {
    it("sorts ascending by default", () => {
        const arr = [{ v: 3 }, { v: 1 }, { v: 2 }];
        expect(sortBy(arr, { key: "v" })).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }]);
    });

    it("sorts descending when order is 'desc'", () => {
        const arr = [{ v: 3 }, { v: 1 }, { v: 2 }];
        expect(sortBy(arr, { key: "v", order: "desc" })).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }]);
    });

    it("does not mutate the input array", () => {
        const arr = [{ v: 3 }, { v: 1 }, { v: 2 }];
        const before = [...arr];
        sortBy(arr, { key: "v" });
        expect(arr).toEqual(before);
    });

    it("returns a new array reference", () => {
        const arr = [{ v: 1 }];
        expect(sortBy(arr, { key: "v" })).not.toBe(arr);
    });
});

describe("statsArrayToObject", () => {
    it("builds an object keyed by name with the value", () => {
        expect(
            statsArrayToObject([
                { name: "attack_power", value: 5 },
                { name: "defence", value: 3 },
            ])
        ).toEqual({ attack_power: 5, defence: 3 });
    });

    it("returns an empty object for an empty array", () => {
        expect(statsArrayToObject([])).toEqual({});
    });

    it("keeps the last value when a name repeats", () => {
        expect(
            statsArrayToObject([
                { name: "speed", value: 1 },
                { name: "speed", value: 9 },
            ])
        ).toEqual({ speed: 9 });
    });
});

describe("addStats / removeStats", () => {
    it("addStats sums overlapping keys and keeps the base for the rest", () => {
        expect(addStats({ attack_power: 5, defence: 2 }, { attack_power: 3 })).toEqual({
            attack_power: 8,
            defence: 2,
        });
    });

    it("removeStats subtracts overlapping keys", () => {
        expect(removeStats({ attack_power: 5, defence: 2 }, { attack_power: 3 })).toEqual({
            attack_power: 2,
            defence: 2,
        });
    });
});
