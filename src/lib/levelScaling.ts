import { SPELL_DEFS } from "@/types/game";
import type { SpellLevel, SpellType } from "@/types/game";
import type { EffectValue } from "@entities/UI/StatusEffects";

// Spell-level scaling (#387), Phaser-free. Each spell declares per-aspect
// curves in SPELL_DEFS[type].scaling; an aspect without a curve keeps its L1
// value at every level.

export const levelFactor = (
    spell: SpellType | undefined,
    aspect: string,
    level: SpellLevel
): number => (spell ? (SPELL_DEFS[spell].scaling?.[aspect]?.[level] ?? 1) : 1);

// Scale a buff/bane stat-modifier map, each stat by its own aspect (the stat
// name). Flat values are multiplied; functions of the base stat have their
// result multiplied. Unscaled entries are returned as-is.
export const scaleEffect = <T extends Record<string, EffectValue>>(
    spell: SpellType | undefined,
    base: T,
    level: SpellLevel
): T => {
    const scaled: Record<string, EffectValue> = {};
    for (const [key, entry] of Object.entries(base)) {
        const f = levelFactor(spell, key, level);
        scaled[key] =
            f === 1
                ? entry
                : typeof entry === "function"
                  ? (bs: number) => entry(bs) * f
                  : entry * f;
    }
    return scaled as T;
};

// "135% power, 120% duration" — the aspects that differ from L1 at `level`;
// empty when nothing scales (the ability card then hides its Next line).
export const levelSummary = (spell: SpellType, level: SpellLevel): string =>
    Object.entries(SPELL_DEFS[spell].scaling ?? {})
        .flatMap(([aspect, curve]) =>
            curve && curve[level] !== 1
                ? [`${Math.round(curve[level] * 100)}% ${aspectLabel(aspect)}`]
                : []
        )
        .join(", ");

// `critical_chance` → "critical chance", `hpPerTick` → "hp per tick".
const aspectLabel = (aspect: string): string =>
    aspect
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase();
