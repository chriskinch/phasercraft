import React from "react";
import LootIcon from "@components/LootIcon";
import { colorForQuality } from "@/lib/armoryClient";
import { pixelEmbossVars } from "@ui/themes";
import theme from "@ui/themes.module.css";
import styles from "./ForgeSlot.module.css";

// Light rarity tints for a filled slot's emboss, from the Blacksmith spec's
// table. The slot carries the item's rarity so the sprite can sit on it bare.
const RARITY_TINT: Record<string, { rgb: string; a: number }> = {
    common: { rgb: "187,187,187", a: 0.35 },
    fine: { rgb: "0,221,0", a: 0.18 },
    rare: { rgb: "0,119,255", a: 0.16 },
    epic: { rgb: "153,0,255", a: 0.16 },
    legendary: { rgb: "255,153,0", a: 0.2 },
};

// `pixelEmbossVars` derives the lip from the fill at 3x alpha, which matches the
// spec's lip column closely enough to keep one seam rather than two.
const tintVars = (quality: string) => pixelEmbossVars(RARITY_TINT[quality] ?? RARITY_TINT.common);

interface ForgeSlotProps {
    quality?: string;
    category?: string;
    icon?: string;
    // Custom content (e.g. a scroll sprite) in place of a loot icon.
    children?: React.ReactNode;
    empty?: React.ReactNode;
    emptyTint?: React.CSSProperties;
}

// One square slot on a crafting line (Blacksmith forge, Arcanum Craft). Filled
// slots take a rarity-tinted emboss and draw the sprite bare; empty ones keep
// the default emboss unless given their own tint (the special slot's faint purple).
const ForgeSlot: React.FC<ForgeSlotProps> = ({
    quality,
    category,
    icon,
    children,
    empty,
    emptyTint,
}) => (
    <div
        className={`${theme.pixelEmboss} ${styles.slot}`}
        style={quality ? tintVars(quality) : emptyTint}
    >
        {children ??
            (category && icon ? (
                <LootIcon
                    bare
                    category={category}
                    color={colorForQuality(quality ?? "common")}
                    icon={icon}
                />
            ) : (
                <span className={styles.slotEmpty}>{empty}</span>
            ))}
    </div>
);

export default ForgeSlot;
