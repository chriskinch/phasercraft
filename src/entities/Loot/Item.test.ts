import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Item generation is RNG-driven via lodash `random`/`sample`. We mock both so
// every draw is deterministic, letting us pin the exact stat-pool maths, key
// generation, allocation iterator, the per-stat adjust formulas/labels, and the
// category->set mapping. `lodash/findKey` is left real (pure lookup).

const randomMock = vi.fn();
const sampleMock = vi.fn();

vi.mock("lodash/random", () => ({ default: (...args: number[]) => randomMock(...args) }));
vi.mock("lodash/sample", () => ({ default: (arr: unknown[]) => sampleMock(arr) }));
vi.mock("uuid", () => ({ v4: () => "test-uuid" }));

import Item from "./Item";

const baseConfig = {
    base: 100,
    multiplier: 10,
    keys: { min: 1, max: 3 },
};

beforeEach(() => {
    randomMock.mockReset();
    sampleMock.mockReset();
    // Safe defaults so an unparametrised construct still completes.
    randomMock.mockReturnValue(1);
    sampleMock.mockReturnValue("attack_power");
});

afterEach(() => {
    vi.restoreAllMocks();
});

// Build an Item without running the RNG-heavy constructor logic, so individual
// methods can be exercised in isolation (mirrors the prototype-fake seam used in
// the lifecycle tests).
function bareItem(): Item {
    const item = Object.create(Item.prototype) as Item;
    item.base = baseConfig.base;
    item.multiplier = baseConfig.multiplier;
    item.keys = baseConfig.keys;
    return item;
}

describe("generateStatPool", () => {
    it("computes Math.round(random(base+adj, base*2+adj) * random(1, 1.3))", () => {
        const item = bareItem();
        // wave = 1, multiplier = 10 => adjustor = 10.
        // First random() returns the pool seed, second the multiplier factor.
        randomMock.mockReturnValueOnce(150).mockReturnValueOnce(1.2);

        expect(item.generateStatPool(100)).toBe(Math.round(150 * 1.2));
        // First call uses the documented range bounds.
        expect(randomMock).toHaveBeenNthCalledWith(1, 110, 210);
        expect(randomMock).toHaveBeenNthCalledWith(2, 1, 1.3);
    });

    it("stays within the documented range when factor is 1", () => {
        const item = bareItem();
        // Force the seed to the lower/upper bound and factor 1.
        randomMock.mockReturnValueOnce(110).mockReturnValueOnce(1);
        expect(item.generateStatPool(100)).toBe(110);
    });
});

describe("generateKeys", () => {
    it("draws `random(min,max)` keys, each via sample(stat_names)", () => {
        const item = bareItem();
        randomMock.mockReturnValueOnce(3); // count
        sampleMock
            .mockReturnValueOnce("attack_power")
            .mockReturnValueOnce("defence")
            .mockReturnValueOnce("speed");

        const names = ["attack_power", "defence", "speed", "magic_power"];
        const keys = item.generateKeys({ min: 1, max: 3 }, names);

        expect(randomMock).toHaveBeenCalledWith(1, 3);
        expect(keys).toEqual(["attack_power", "defence", "speed"]);
        expect(sampleMock).toHaveBeenCalledTimes(3);
    });

    it("returns a count within [min, max] across many draws (invariant)", () => {
        const item = bareItem();
        const names = ["attack_power", "defence"];
        for (let n = 2; n <= 5; n++) {
            randomMock.mockReturnValueOnce(n);
            sampleMock.mockReturnValue("attack_power");
            expect(item.generateKeys({ min: 2, max: 5 }, names)).toHaveLength(n);
        }
    });
});

describe("allocateStatIterator", () => {
    it("deducts a share per call and gives the remainder to the final stat", () => {
        const item = bareItem();
        // length 2 => range = 1/4. Force random to return the low bound `range`.
        randomMock.mockReturnValue(0.25);
        const it = item.allocateStatIterator(1000, 2);

        const first = it.next("attack_power");
        // deduction = round(1000 * 0.25) = 250
        expect(first).toEqual({ value: 250, done: false, key: "attack_power" });

        const second = it.next("defence");
        // remainder = 1000 - 250 = 750, flagged done.
        expect(second).toEqual({ value: 750, done: true, key: "defence" });
    });

    it("conserves the pool: allocations sum to the original pool", () => {
        const item = bareItem();
        randomMock.mockReturnValue(0.1);
        const pool = 900;
        const length = 4;
        const it = item.allocateStatIterator(pool, length);

        let sum = 0;
        for (let i = 0; i < length; i++) {
            sum += it.next(`k${i}`).value;
        }
        expect(sum).toBe(pool);
    });
});

describe("adjustStats", () => {
    const cases: Array<
        [string, number, Partial<{ adjusted: number; format: string; abr: string }>]
    > = [
        ["attack_power", 10, { adjusted: 5, format: "basic", abr: "AP" }],
        ["attack_speed", 1000, { adjusted: -1, format: "percent", abr: "AS" }],
        ["critical_chance", 100, { adjusted: 10, format: "percent", abr: "C" }],
        ["defence", 10, { adjusted: 5, format: "basic", abr: "D" }],
        ["health_max", 3, { adjusted: 12, format: "basic", abr: "H" }],
        ["health_regen_rate", 1000, { adjusted: -1, format: "percent", abr: "RR" }],
        ["health_regen_value", 100, { adjusted: 10, format: "basic", abr: "RV" }],
        ["magic_power", 10, { adjusted: 5, format: "basic", abr: "MP" }],
        ["speed", 100, { adjusted: 10, format: "basic", abr: "S" }],
    ];

    it.each(cases)("maps %s to its formula/format/abr", (key, value, expected) => {
        const item = bareItem();
        const result = item.adjustStats({ value, done: false, key });
        expect(result).toMatchObject(expected);
        // The original stat fields are spread through.
        expect(result.key).toBe(key);
    });

    it("falls back to the `default` shape for an unknown key", () => {
        const item = bareItem();
        const result = item.adjustStats({ value: 42, done: false, key: "nonsense" });
        expect(result).toMatchObject({
            adjusted: 42,
            format: "basic",
            label: "Default",
            abr: "Default",
        });
    });
});

describe("round", () => {
    it("ceils basic stats to a whole number", () => {
        const item = bareItem();
        const out = item.round({
            adjusted: 5.2,
            format: "basic",
            label: "x",
            short: "x",
            abr: "x",
        });
        expect((out as unknown as { rounded: number }).rounded).toBe(6);
    });

    it("ceils percent stats to two decimals", () => {
        const item = bareItem();
        const out = item.round({
            adjusted: 0.121,
            format: "percent",
            label: "x",
            short: "x",
            abr: "x",
        });
        expect((out as unknown as { rounded: number }).rounded).toBe(0.13);
    });
});

describe("getCategory / getIcon / getSet", () => {
    it("getCategory returns a sampled category", () => {
        const item = bareItem();
        sampleMock.mockReturnValueOnce("sword");
        expect(item.getCategory()).toBe("sword");
    });

    it("getIcon picks `category_n` within the category's max", () => {
        const item = bareItem();
        randomMock.mockReturnValueOnce(7);
        expect(item.getIcon("sword")).toBe("sword_7");
        expect(randomMock).toHaveBeenCalledWith(1, 24);
    });

    it.each([
        ["amulet", "amulet"],
        ["gem", "amulet"],
        ["misc", "amulet"],
        ["armor", "body"],
        ["helmet", "helm"],
        ["axe", "weapon"],
        ["bow", "weapon"],
        ["staff", "weapon"],
        ["sword", "weapon"],
    ])("getSet maps %s -> %s", (category, set) => {
        const item = bareItem();
        expect(item.getSet(category)).toBe(set);
    });
});

describe("constructor assembly", () => {
    it("assembles stats, category, icon, set and uuid from the RNG draws", () => {
        // stat_pool: seed*factor
        randomMock
            .mockReturnValueOnce(200) // generateStatPool seed
            .mockReturnValueOnce(1) // generateStatPool factor => pool 200
            .mockReturnValueOnce(2); // generateKeys count = 2
        // two distinct keys so the Set keeps both
        sampleMock.mockReturnValueOnce("attack_power").mockReturnValueOnce("defence");
        // Remaining random draws (allocation share + icon index) default to 3.
        randomMock.mockReturnValue(3);
        sampleMock.mockReturnValueOnce("sword"); // category

        const item = new Item({ ...baseConfig });

        expect(item.stat_pool).toBe(200);
        expect(Object.keys(item.stats).sort()).toEqual(["attack_power", "defence"]);
        expect(item.category).toBe("sword");
        // icon is `${category}_${random(1,max)}`; max=24 for sword, draw forced to 3.
        expect(item.icon).toBe("sword_3");
        expect(item.set).toBe("weapon");
        expect(item.uuid).toBe("test-uuid");
        // Allocations conserve the pool.
        const allocated = (item.stats.attack_power.value ?? 0) + (item.stats.defence.value ?? 0);
        expect(allocated).toBe(item.stat_pool);
    });

    it("dedupes repeated sampled keys via the Set", () => {
        randomMock.mockReturnValueOnce(200).mockReturnValueOnce(1).mockReturnValueOnce(3); // ask for 3 keys
        sampleMock
            .mockReturnValueOnce("speed")
            .mockReturnValueOnce("speed")
            .mockReturnValueOnce("speed");
        randomMock.mockReturnValue(0.5); // share draws + icon
        sampleMock.mockReturnValueOnce("gem"); // category

        const item = new Item({ ...baseConfig });
        expect(Object.keys(item.stats)).toEqual(["speed"]);
        expect(item.set).toBe("amulet");
    });
});
