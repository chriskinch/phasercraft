import type { SpellLevel, SpellType } from "@/types/game";

// Scroll drops (#385). A `scroll` loot-table entry drops one scroll, of a spell
// rolled from SCROLL_DROP_WEIGHTS, into the unread `scrolls` save slice.

// Drop rates for the `scroll` loot-table entry, in `Enemy.dropLoot`'s "drops per
// kill x 100" units: 5% from a regular mob, exactly one from a miniboss.
export const SCROLL_DROP_RATE = { mob: 5, miniboss: 100 } as const;

// Dropped scrolls are always L1; higher levels come from merging at the Arcanum (#386).
export const SCROLL_DROP_LEVEL: SpellLevel = 1;

// The scroll loot table: each spell's relative chance of being the scroll that
// drops. Every spell drops, off-class ones too (universal drop, #384), and all
// weigh the same for now. Keyed by SpellType, so a new spell is a type error
// until it is added here; scrollDrops.test.ts fails on it too.
export const SCROLL_DROP_WEIGHTS: Record<SpellType, number> = {
    AimedShot: 1,
    BattleStomp: 1,
    BloodFurnace: 1,
    Consecration: 1,
    EarthShield: 1,
    Enrage: 1,
    Enfeeble: 1,
    Faith: 1,
    Fireball: 1,
    Focus: 1,
    Frostbolt: 1,
    Heal: 1,
    Invocation: 1,
    ManaShield: 1,
    Multishot: 1,
    PowerInfusion: 1,
    SiphonSoul: 1,
    Smite: 1,
    SnareTrap: 1,
    Retaliation: 1,
    Whirlwind: 1,
};

// A spell weighted 0 never drops.
const POOL = (Object.entries(SCROLL_DROP_WEIGHTS) as [SpellType, number][]).filter(
    ([, weight]) => weight > 0
);
const TOTAL_WEIGHT = POOL.reduce((total, [, weight]) => total + weight, 0);

// The spell a dropped scroll is for: `roll` in [0, 1) walks the pool, each spell
// taking a share of the range in proportion to its weight.
export const rollScrollSpell = (roll: number = Math.random()): SpellType => {
    let left = roll * TOTAL_WEIGHT;
    for (const [spell, weight] of POOL) {
        if (left < weight) return spell;
        left -= weight;
    }
    // Only float rounding at the very top of the range gets here.
    return POOL[POOL.length - 1][0];
};
