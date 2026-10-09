import {
    COMPONENT_DEFS,
    SCROLL_DISPEL_COST,
    SCROLL_MERGE_COUNT,
    SPELL_DEFS,
    SPELL_RECIPES,
    specialById,
} from "@/types/game";
import type { ComponentStack, ComponentType, SpellLevel } from "@/types/game";
import type { SpellType } from "@entities/Spells/AssignSpell";
import { missingMaterials } from "./materials";

// Phaser-free rules for Arcanum spell crafting (#580): Trade (learn a recipe),
// Craft (L1 scroll) and Dispel. The reducers gate on these same checks, so
// the Arcanum's enabled buttons and hints can never disagree with the store.

export interface CraftContext {
    spellRecipes: readonly SpellType[];
    scrolls: Partial<Record<SpellType, Partial<Record<SpellLevel, number>>>>;
    components: ComponentStack[];
    specials: Record<string, number>;
    coins: number;
}

export interface ActionStatus {
    enabled: boolean;
    hint: string;
}

const held = (ctx: CraftContext, spell: SpellType, level: SpellLevel) =>
    ctx.scrolls[spell]?.[level] ?? 0;

const specialName = (id: string) => specialById(id)?.name ?? id;

// One scroll at `level` is worth this many L1 crafts: ×3 per level (Merge's inverse).
export const levelMultiplier = (level: SpellLevel): number => SCROLL_MERGE_COUNT ** (level - 1);

export interface DispelYield {
    materials: Partial<Record<ComponentType, number>>;
    special: string;
    specials: number;
}

export const dispelYield = (spell: SpellType, level: SpellLevel): DispelYield => {
    const recipe = SPELL_RECIPES[spell];
    const times = levelMultiplier(level);
    const materials: Partial<Record<ComponentType, number>> = {};
    for (const [type, count] of Object.entries(recipe.materials) as [ComponentType, number][]) {
        materials[type] = count * times;
    }
    return { materials, special: recipe.special, specials: times };
};

export const yieldText = ({ materials, special, specials }: DispelYield): string =>
    [
        ...(Object.entries(materials) as [ComponentType, number][]).map(
            ([type, count]) => `${count} ${COMPONENT_DEFS[type].name}`
        ),
        `${specials} ${specialName(special)}`,
    ].join(", ");

export const tradeStatus = (
    ctx: CraftContext,
    spell: SpellType,
    level: SpellLevel
): ActionStatus => {
    const name = SPELL_DEFS[spell].name;
    if (held(ctx, spell, level) < 1) return { enabled: false, hint: "No scroll to trade." };
    if (ctx.spellRecipes.includes(spell)) {
        return { enabled: false, hint: `${name} recipe already known.` };
    }
    return { enabled: true, hint: `Trade to learn the ${name} recipe.` };
};

export const craftStatus = (ctx: CraftContext, spell: SpellType): ActionStatus => {
    const name = SPELL_DEFS[spell].name;
    if (!ctx.spellRecipes.includes(spell)) {
        return { enabled: false, hint: `Trade a ${name} scroll to learn its recipe.` };
    }
    const recipe = SPELL_RECIPES[spell];
    const short = (
        Object.entries(missingMaterials(ctx.components, recipe)) as [ComponentType, number][]
    ).map(([type, count]) => `${count} more ${COMPONENT_DEFS[type].name}`);
    if ((ctx.specials[recipe.special] ?? 0) < 1) short.push(`1 ${specialName(recipe.special)}`);
    if (ctx.coins < recipe.coins) short.push(`${recipe.coins - ctx.coins} more coins`);
    if (short.length > 0) return { enabled: false, hint: `Need ${short.join(", ")}.` };
    return { enabled: true, hint: `Crafts 1 ${name} L1.` };
};

export const dispelStatus = (
    ctx: CraftContext,
    spell: SpellType,
    level: SpellLevel
): ActionStatus => {
    if (held(ctx, spell, level) < 1) return { enabled: false, hint: "No scroll to dispel." };
    if (!ctx.spellRecipes.includes(spell)) {
        return { enabled: false, hint: "Learn its recipe first (Trade)." };
    }
    if (ctx.coins < SCROLL_DISPEL_COST) {
        return {
            enabled: false,
            hint: `Need ${SCROLL_DISPEL_COST - ctx.coins} more coins (fee ${SCROLL_DISPEL_COST}).`,
        };
    }
    return {
        enabled: true,
        hint: `Returns ${yieldText(dispelYield(spell, level))} for ${SCROLL_DISPEL_COST} coins.`,
    };
};
