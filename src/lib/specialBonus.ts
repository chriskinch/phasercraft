import { appliedStatValue, conversionFor, formatStatValue } from "@/lib/statConversion";
import type { SpecialItem } from "@/types/game";

/**
 * A special item's bonus as a stat row (label + signed display value),
 * formatted like any gear stat. Shared by the Blacksmith and the inventory.
 */
export const specialBonusRow = (special: SpecialItem) => {
    const { name, value } = special.bonus;
    return {
        name,
        label: conversionFor(name).label,
        display: formatStatValue(name, appliedStatValue(name, value), { signed: true }),
    };
};
