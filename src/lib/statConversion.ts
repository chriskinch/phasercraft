// Single source of truth for turning a raw gear stat roll into the magnitude the
// game actually applies.
//
// A generated item allocates an integer `value` out of its stat pool (see
// `Item.allocateStatIterator`). That number is in pool units, not stat units: each
// stat converts it differently — `health_max` multiplies by 4, `critical_chance`
// divides by 10, and the two *interval* stats (`attack_speed`, `health_regen_rate`)
// negate it, because for those a lower number is faster.
//
// Both the item tooltip and the equip/unequip reducers must agree on that
// conversion. They previously did not: the tooltip rendered the converted value
// while the reducer added the raw pool number to `base_stats`, so a +30 roll on
// `attack_speed` turned a 1s attack cooldown into 31s. Everything that applies or
// displays a gear stat now goes through `appliedStatValue`.

export type StatFormat = "basic" | "percent";

export interface StatConversion {
    /** Raw pool units → stat units. */
    convert: (value: number) => number;
    format: StatFormat;
    label: string;
    short: string;
    abr: string;
}

/**
 * `attack_speed` and `health_regen_rate` are intervals in seconds
 * (`Player.attack` uses `delay: attack_speed * 1000`; `Resource.createTick` uses
 * `delay: 1 + regen_rate * 1000`), so a *negative* delta is the buff.
 */
const CONVERSIONS: Readonly<Record<string, StatConversion>> = Object.freeze({
    attack_power: {
        convert: (v) => v / 2,
        format: "basic",
        label: "Attack Power",
        short: "Atk Pwr",
        abr: "AP",
    },
    attack_speed: {
        convert: (v) => -v / 1000,
        format: "percent",
        label: "Attack Speed",
        short: "Atk Spd",
        abr: "AS",
    },
    critical_chance: {
        convert: (v) => v / 10,
        format: "percent",
        label: "Critical Chance",
        short: "Crit",
        abr: "C",
    },
    defence: {
        convert: (v) => v / 2,
        format: "basic",
        label: "Defence",
        short: "Def",
        abr: "D",
    },
    health_max: {
        convert: (v) => v * 4,
        format: "basic",
        label: "Health Max",
        short: "Health",
        abr: "H",
    },
    health_regen_rate: {
        convert: (v) => -v / 1000,
        format: "percent",
        label: "Regen Rate",
        short: "Reg R",
        abr: "RR",
    },
    health_regen_value: {
        convert: (v) => v / 10,
        format: "basic",
        label: "Regen Value",
        short: "Reg V",
        abr: "RV",
    },
    magic_power: {
        convert: (v) => v / 2,
        format: "basic",
        label: "Magic Power",
        short: "Mgc Pwr",
        abr: "MP",
    },
    speed: {
        convert: (v) => v / 10,
        format: "basic",
        label: "Speed",
        short: "Spd",
        abr: "S",
    },
});

export const DEFAULT_CONVERSION: StatConversion = Object.freeze({
    convert: (v: number) => v,
    format: "basic",
    label: "Default",
    short: "Default",
    abr: "Default",
});

/** The conversion for `name`, falling back to the identity conversion. */
export const conversionFor = (name: string): StatConversion =>
    CONVERSIONS[name] ?? DEFAULT_CONVERSION;

/** Percent stats keep 2dp; everything else is a whole number. Always rounds up. */
export const roundStat = (adjusted: number, format: StatFormat): number =>
    format === "percent" ? Math.ceil((adjusted + Number.EPSILON) * 100) / 100 : Math.ceil(adjusted);

/**
 * Raw pool `value` → the magnitude added to (or subtracted from) `base_stats`.
 * This is the same number the tooltip shows, so what a player reads is what they get.
 */
export const appliedStatValue = (name: string, value: number): number => {
    const conversion = conversionFor(name);
    return roundStat(conversion.convert(value), conversion.format);
};
