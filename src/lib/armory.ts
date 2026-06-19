import type { Item as ApiItem } from "../../api/_lib/types";
import type { LootItem } from "@/types/game";

const qualityColors: Record<string, string> = {
    common: "#bbbbbb",
    fine: "#00dd00",
    rare: "#0077ff",
    epic: "#9900ff",
    legendary: "#ff9900",
};

export function enrichItem(raw: ApiItem): LootItem {
    return {
        ...raw,
        set: raw.set ?? undefined,
        color: qualityColors[raw.quality] ?? "#bbbbbb",
    };
}
