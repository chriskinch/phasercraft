import { SPELL_DEFS, SPELL_LEVELS } from "@/types/game";
import type { SpellLevel } from "@/types/game";
import type { PlayerName } from "@entities/Player/AssignClass";
import type { SpellType } from "@entities/Spells/AssignSpell";
import { isOnClass } from "./classKits";

// Phaser-free rules for the Equipment → Scrolls tab (spec: docs/specs/abilities-ui.md
// → Equipment → Scrolls tab). Mirrors the `readScroll` reducer's guards so the
// Learn button is only enabled when the read would succeed.

export const MAX_SPELL_LEVEL: SpellLevel = SPELL_LEVELS[SPELL_LEVELS.length - 1];

export type ScrollState = "learn" | "upgrade" | "merge" | "max" | "offClass";

export interface ScrollStatus {
    state: ScrollState;
    readable: boolean;
    // Hint line under the scroll's tooltip (purple when readable, red when not).
    hint: string;
}

interface AbilityContext {
    character: PlayerName | null;
    learnedSpells: Partial<Record<SpellType, SpellLevel>>;
    abilityLoadout: readonly (SpellType | null)[];
}

// The spec's state table, in priority order: class lock first, then learned level.
export const scrollStatus = (
    { character, learnedSpells, abilityLoadout }: AbilityContext,
    spell: SpellType,
    level: SpellLevel
): ScrollStatus => {
    const def = SPELL_DEFS[spell];
    if (!isOnClass(character, spell)) {
        return {
            state: "offClass",
            readable: false,
            hint: `${def.classes.join(", ")} only. Sell it or use it at the Arcanum.`,
        };
    }
    const current = learnedSpells[spell];
    if (current === undefined) {
        const fills = abilityLoadout.includes(null)
            ? "and fills the first empty slot."
            : "— open Abilities to equip.";
        return { state: "learn", readable: true, hint: `Learns ${def.name} at L${level} ${fills}` };
    }
    if (level > current) {
        return {
            state: "upgrade",
            readable: true,
            hint: `Upgrades ${def.name} L${current} → L${level}.`,
        };
    }
    if (level >= MAX_SPELL_LEVEL) {
        return { state: "max", readable: false, hint: "Max level — sell or keep for recipes." };
    }
    return {
        state: "merge",
        readable: false,
        hint: `Merge 3 at the Arcanum to make L${level + 1}.`,
    };
};

// Toast after a successful Learn, worked out from the state *before* the read
// (the reducer auto-equips a newly learned spell into the first empty slot).
export const learnToast = (
    { learnedSpells, abilityLoadout }: Omit<AbilityContext, "character">,
    spell: SpellType,
    level: SpellLevel
): string => {
    const name = SPELL_DEFS[spell].name;
    if (learnedSpells[spell] !== undefined) return `Upgraded ${name} to L${level}`;
    const slotted = abilityLoadout.indexOf(spell);
    const slot = slotted !== -1 ? slotted : abilityLoadout.indexOf(null);
    return slot === -1
        ? `Learned ${name} (L${level}) — open Abilities to equip`
        : `Learned ${name} (L${level}) — equipped in slot ${slot + 1}`;
};

export interface ScrollStackView {
    // `<SpellType>_l<level>`, unique per tile.
    key: string;
    spell: SpellType;
    level: SpellLevel;
    count: number;
}

export const scrollKey = (spell: SpellType, level: SpellLevel): string => `${spell}_l${level}`;

// One tile per spell + level held, by spell name then level.
export const scrollStacks = (
    scrolls: Partial<Record<SpellType, Partial<Record<SpellLevel, number>>>>
): ScrollStackView[] =>
    (Object.keys(scrolls) as SpellType[])
        .filter((spell) => spell in SPELL_DEFS)
        .sort((a, b) => SPELL_DEFS[a].name.localeCompare(SPELL_DEFS[b].name))
        .flatMap((spell) =>
            SPELL_LEVELS.flatMap((level) => {
                const count = scrolls[spell]?.[level] ?? 0;
                return count > 0 ? [{ key: scrollKey(spell, level), spell, level, count }] : [];
            })
        );
