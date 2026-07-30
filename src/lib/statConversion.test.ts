import { describe, it, expect } from "vitest";
import { appliedStatValue, conversionFor, roundStat, DEFAULT_CONVERSION } from "./statConversion";

describe("statConversion", () => {
    describe("conversionFor", () => {
        it("returns the identity conversion for an unknown stat", () => {
            expect(conversionFor("not_a_stat")).toBe(DEFAULT_CONVERSION);
            expect(appliedStatValue("not_a_stat", 30)).toBe(30);
        });

        // The conversion table inherits from Object.prototype, so an unguarded
        // `CONVERSIONS[name] ?? DEFAULT` lookup resolves these to inherited functions
        // with no `convert` and throws. Stat names can arrive from the armory service,
        // so an unknown name must always degrade to identity.
        it.each(["constructor", "toString", "valueOf", "hasOwnProperty", "__proto__"])(
            "falls back to identity for the prototype key %s",
            (name) => {
                expect(conversionFor(name)).toBe(DEFAULT_CONVERSION);
                expect(() => appliedStatValue(name, 30)).not.toThrow();
                expect(appliedStatValue(name, 30)).toBe(30);
            }
        );

        it("carries the display metadata each stat renders with", () => {
            expect(conversionFor("attack_speed")).toMatchObject({
                format: "percent",
                label: "Attack Speed",
                abr: "AS",
            });
            expect(conversionFor("health_max")).toMatchObject({
                format: "basic",
                label: "Health Max",
                abr: "H",
            });
        });
    });

    describe("roundStat", () => {
        it("keeps two decimal places for percent stats", () => {
            expect(roundStat(0.0301, "percent")).toBe(0.04);
        });

        it("rounds basic stats up to a whole number", () => {
            expect(roundStat(15.2, "basic")).toBe(16);
        });

        // Pre-existing behaviour, carried over verbatim from Item.round(): rounding is
        // Math.ceil, which rounds *towards* zero for negatives. The interval stats are
        // negative, so their magnitude is always shaved slightly rather than grown.
        // Flagged rather than changed -- altering it is a balance decision.
        it("rounds negative percent stats towards zero", () => {
            expect(roundStat(-0.03, "percent")).toBe(-0.02);
        });
    });

    describe("appliedStatValue", () => {
        // The interval stats are the reason this module exists: a bigger roll has to
        // produce a *smaller* number, because the value is a delay in seconds.
        const cases: Array<[string, number, number]> = [
            ["attack_speed", 30, -0.02],
            ["health_regen_rate", 30, -0.02],
        ];
        it.each(cases)("negates %s so a bigger roll is faster", (name, value, expected) => {
            const applied = appliedStatValue(name, value);
            expect(applied).toBeLessThan(0);
            expect(applied).toBe(expected);
        });

        const scaled: Array<[string, number, number]> = [
            ["attack_power", 30, 15],
            ["magic_power", 30, 15],
            ["defence", 30, 15],
            ["critical_chance", 30, 3],
            ["speed", 30, 3],
            ["health_max", 30, 120],
            ["health_regen_value", 30, 3],
        ];
        it.each(scaled)("scales %s from pool units to stat units", (name, value, expected) => {
            expect(appliedStatValue(name, value)).toBe(expected);
        });

        it("never returns the raw pool value for a scaled stat", () => {
            // Regression: the equip reducer used to add the raw roll straight to
            // base_stats, which turned a 1s attack cooldown into 31s.
            expect(appliedStatValue("attack_speed", 30)).not.toBe(30);
            expect(appliedStatValue("health_max", 30)).not.toBe(30);
        });
    });
});
