import { describe, it, expect, afterEach, vi } from "vitest";
import { gql } from "@apollo/client";
import { cache } from "./cache";

// Unit tests for the Apollo InMemoryCache field policies (Phase 4, #309).
//
// These exercise the real `cache` instance and its `typePolicies` end-to-end:
// we write a normalized Item/Stat object into the cache and read back the
// computed `color` / `adjusted` / `formatted` / `abbreviation` fields. That
// way the test pins the actual policy wiring (which source field each read
// function consumes and the formula/lookup it applies), not a copy of the
// logic. No production code is changed — the read functions stay private.
//
// Each computed field has to be requested explicitly in the query, and the
// underlying source field (quality / name / value / converted) has to be
// present in the written object for `readField` to find it.

const ITEM_QUERY = gql`
    query ItemColor($id: ID!) {
        item(id: $id) {
            id
            quality
            color
        }
    }
`;

const STAT_QUERY = gql`
    query StatComputed($id: ID!) {
        stat(id: $id) {
            id
            name
            value
            converted
            adjusted
            formatted
            abbreviation
        }
    }
`;

afterEach(() => {
    // Isolate cases: clear the shared, exported cache between tests.
    cache.restore({});
    vi.restoreAllMocks();
});

function writeItem(quality: string | null) {
    cache.writeQuery({
        query: ITEM_QUERY,
        variables: { id: "i1" },
        data: {
            item: {
                __typename: "Item",
                id: "i1",
                quality,
                color: undefined,
            },
        },
    });
}

function readItemColor(): string | undefined {
    // `returnPartialData` so an unknown quality (color resolves to `undefined`)
    // still yields the item rather than a `null` whole-query result.
    const result = cache.readQuery<{ item: { color?: string } }>({
        query: ITEM_QUERY,
        variables: { id: "i1" },
        returnPartialData: true,
    });
    if (!result?.item) throw new Error("item not found in cache");
    return result.item.color;
}

function writeStat(name: string, value: number, converted: number) {
    cache.writeQuery({
        query: STAT_QUERY,
        variables: { id: "s1" },
        data: {
            stat: {
                __typename: "Stat",
                id: "s1",
                name,
                value,
                converted,
                adjusted: undefined,
                formatted: undefined,
                abbreviation: undefined,
            },
        },
    });
}

function readStat(): {
    adjusted?: number;
    formatted?: string | number;
    abbreviation?: string;
} {
    // `returnPartialData` so a computed field that resolves to `undefined`
    // (an unknown stat key for `abbreviation`) doesn't make Apollo treat the
    // whole result as incomplete and hand back `null`.
    const result = cache.readQuery<{
        stat: { adjusted?: number; formatted?: string | number; abbreviation?: string };
    }>({
        query: STAT_QUERY,
        variables: { id: "s1" },
        returnPartialData: true,
    });
    if (!result?.stat) throw new Error("stat not found in cache");
    return result.stat;
}

describe("Item.color field policy", () => {
    it.each([
        ["common", "#bbbbbb"],
        ["fine", "#00dd00"],
        ["rare", "#0077ff"],
        ["epic", "#9900ff"],
        ["legendary", "#ff9900"],
    ])("maps quality %s to %s", (quality, expected) => {
        writeItem(quality);
        expect(readItemColor()).toBe(expected);
    });

    it("returns undefined for an unknown quality", () => {
        writeItem("mythic");
        expect(readItemColor()).toBeUndefined();
    });
});

describe("Stat.adjusted field policy", () => {
    it.each([
        ["attack_power", 10, 5],
        ["attack_speed", 2000, -2],
        ["critical_chance", 50, 5],
        ["defence", 8, 4],
        ["health_max", 3, 12],
        ["health_regen_rate", 2000, -2],
        ["health_regen_value", 50, 5],
        ["magic_power", 10, 5],
        ["speed", 30, 3],
    ])("applies the %s formula", (name, value, expected) => {
        writeStat(name, value, 0);
        expect(readStat().adjusted).toBe(expected);
    });

    it("returns the raw value (and logs) for an unknown stat key", () => {
        const log = vi.spyOn(console, "log").mockImplementation(() => {});
        writeStat("unknown_stat", 42, 0);
        expect(readStat().adjusted).toBe(42);
        expect(log).toHaveBeenCalledWith("No adjustment for [unknown_stat] found.");
    });
});

describe("Stat.formatted field policy", () => {
    it.each(["attack_speed", "critical_chance", "health_regen_rate"])(
        "formats %s as a rounded percentage with a %% suffix",
        (name) => {
            writeStat(name, 0, 1.234);
            // Math.ceil((1.234 + EPSILON) * 100) / 100 = 1.24
            expect(readStat().formatted).toBe("1.24%");
        }
    );

    it("ceils whole-number percentages without changing them", () => {
        writeStat("critical_chance", 0, 5);
        expect(readStat().formatted).toBe("5%");
    });

    it("ceils non-percentage stats to an integer", () => {
        writeStat("attack_power", 0, 4.1);
        expect(readStat().formatted).toBe(5);
    });

    it("leaves an already-integer non-percentage stat unchanged", () => {
        writeStat("attack_power", 0, 7);
        expect(readStat().formatted).toBe(7);
    });
});

describe("Stat.abbreviation field policy", () => {
    it.each([
        ["attack_power", "AP"],
        ["attack_speed", "AS"],
        ["critical_chance", "C"],
        ["defence", "D"],
        ["health_max", "H"],
        ["health_regen_rate", "RR"],
        ["health_regen_value", "RV"],
        ["magic_power", "MP"],
        ["speed", "S"],
    ])("abbreviates %s as %s", (name, expected) => {
        writeStat(name, 0, 0);
        expect(readStat().abbreviation).toBe(expected);
    });

    it("returns undefined for an unknown stat key", () => {
        writeStat("unknown_stat", 0, 0);
        expect(readStat().abbreviation).toBeUndefined();
    });
});
