// Single source of truth for stat semantics: how a raw gear roll converts into the
// magnitude the game applies, and how a stat should be read once it gets there.
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
//
// Two fields carry the *display* semantics, because a bare number is not readable
// on its own: `unit` says what the number measures, and `higherIsBetter` says which
// direction is an improvement. Without the latter, a comparison cannot colour an
// attack-speed upgrade correctly — a smaller number there is the better item.

/** Rounding precision only — NOT the display unit. See `unit` for that. */
export type StatFormat = "basic" | "percent";

/** What the number actually measures, for rendering. */
export type StatUnit = "flat" | "percent" | "seconds";

export interface StatConversion {
    /** Raw pool units → stat units. Identity for display-only stats. */
    convert: (value: number) => number;
    /** Rounding precision: `percent` keeps 2dp, `basic` rounds to a whole number. */
    format: StatFormat;
    /** How to render the value (`12`, `12%`, `0.98s`). */
    unit: StatUnit;
    /** False for interval stats, where a smaller number is the better one. */
    higherIsBetter: boolean;
    label: string;
    short: string;
    abr: string;
}

/**
 * `attack_speed` and `health_regen_rate` are intervals in seconds
 * (`Player.attack` uses `delay: attack_speed * 1000`; `Resource.createTick` uses
 * `delay: 1 + regen_rate * 1000`), so a *negative* delta is the buff and
 * `higherIsBetter` is false.
 *
 * Entries whose `convert` is the identity are display-only: they never roll on gear,
 * but they are shown on the character sheet and need units like everything else.
 */
const CONVERSIONS: Readonly<Record<string, StatConversion>> = Object.freeze({
    attack_power: {
        convert: (v) => v / 2,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Attack Power",
        short: "Atk Pwr",
        abr: "AP",
    },
    attack_speed: {
        convert: (v) => -v / 1000,
        format: "percent",
        unit: "seconds",
        higherIsBetter: false,
        label: "Attack Speed",
        short: "Atk Spd",
        abr: "AS",
    },
    critical_chance: {
        convert: (v) => v / 10,
        format: "percent",
        unit: "percent",
        higherIsBetter: true,
        label: "Critical Chance",
        short: "Crit",
        abr: "C",
    },
    defence: {
        convert: (v) => v / 2,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Defence",
        short: "Def",
        abr: "D",
    },
    health_max: {
        convert: (v) => v * 4,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Health Max",
        short: "Health",
        abr: "H",
    },
    health_regen_rate: {
        convert: (v) => -v / 1000,
        format: "percent",
        unit: "seconds",
        higherIsBetter: false,
        label: "Regen Rate",
        short: "Reg R",
        abr: "RR",
    },
    health_regen_value: {
        convert: (v) => v / 10,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Regen Value",
        short: "Reg V",
        abr: "RV",
    },
    magic_power: {
        convert: (v) => v / 2,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Magic Power",
        short: "Mgc Pwr",
        abr: "MP",
    },
    speed: {
        convert: (v) => v / 10,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Speed",
        short: "Spd",
        abr: "S",
    },

    // Display-only below this line — identity conversion, same as the fallback.
    resource_regen_rate: {
        convert: (v) => v,
        format: "basic",
        unit: "seconds",
        higherIsBetter: false,
        label: "Resource Regen Rate",
        short: "Res R",
        abr: "RRR",
    },
    resource_regen_value: {
        convert: (v) => v,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Resource Regen Value",
        short: "Res V",
        abr: "RRV",
    },
    range: {
        convert: (v) => v,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Range",
        short: "Rng",
        abr: "R",
    },
    knockback: {
        convert: (v) => v,
        format: "basic",
        unit: "flat",
        higherIsBetter: true,
        label: "Knockback",
        short: "Knock",
        abr: "K",
    },
});

export const DEFAULT_CONVERSION: StatConversion = Object.freeze({
    convert: (v: number) => v,
    format: "basic",
    unit: "flat",
    higherIsBetter: true,
    label: "Default",
    short: "Default",
    abr: "Default",
});

/**
 * The conversion for `name`, falling back to the identity conversion.
 *
 * Guarded with `hasOwnProperty` rather than `CONVERSIONS[name] ?? DEFAULT` because
 * the table inherits from `Object.prototype`: a stat named `constructor` or
 * `toString` would otherwise resolve to an inherited function with no `convert`,
 * and throw. Stat names reach here from the armory REST service as well as from
 * generated loot, so an unknown name has to degrade to identity, never crash.
 */
export const conversionFor = (name: string): StatConversion =>
    Object.prototype.hasOwnProperty.call(CONVERSIONS, name)
        ? CONVERSIONS[name]
        : DEFAULT_CONVERSION;

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

/**
 * Whether `delta` (already in stat units) is an improvement for `name`:
 * `1` better, `-1` worse, `0` no change.
 *
 * This exists because `Math.sign(delta)` is wrong for the interval stats — a
 * -0.03s change to `attack_speed` is a *faster* swing, i.e. an upgrade, and must
 * not be coloured as a downgrade.
 */
export const statPolarity = (name: string, delta: number): number => {
    if (delta === 0) return 0;
    return delta > 0 === conversionFor(name).higherIsBetter ? 1 : -1;
};

/**
 * Render a stat value with its unit — `12`, `12%`, `0.98s`.
 *
 * `signed` prefixes an explicit `+` on positive numbers, for comparison rows where
 * the number is a delta rather than an absolute.
 */
export const formatStatValue = (
    name: string,
    value: number,
    { signed = false }: { signed?: boolean } = {}
): string => {
    const { unit } = conversionFor(name);
    const rounded = Math.round(value * 100) / 100;
    const sign = rounded > 0 && signed ? "+" : "";
    const suffix = unit === "percent" ? "%" : unit === "seconds" ? "s" : "";
    return `${sign}${rounded}${suffix}`;
};
