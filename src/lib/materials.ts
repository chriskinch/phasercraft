import type { ComponentStack, ComponentType } from "@/types/game";

// How many of `type` the player holds, summed across every stack of it. A
// component's total is spread over stacks once it passes stackMax, so a crafting
// cost has to be measured (and paid) against the whole set, not one stack.
export const componentTotal = (components: ComponentStack[], type: ComponentType): number =>
    components.reduce((sum, s) => (s.type === type ? sum + s.quantity : sum), 0);

// The materials a recipe (Blacksmith or spell) still needs, given what the
// player holds. Empty means the recipe is materially craftable (coins are
// checked separately). Drives both the reducers' guards and the shops' have/need
// rows, so the UI can never disagree with what the craft will actually allow.
export const missingMaterials = (
    components: ComponentStack[],
    recipe: { materials: Partial<Record<ComponentType, number>> }
): Partial<Record<ComponentType, number>> => {
    const missing: Partial<Record<ComponentType, number>> = {};
    for (const [type, needed] of Object.entries(recipe.materials) as Array<
        [ComponentType, number]
    >) {
        const short = needed - componentTotal(components, type);
        if (short > 0) missing[type] = short;
    }
    return missing;
};
