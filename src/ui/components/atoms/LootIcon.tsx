import React from "react";
import { ICON_TILE } from "@ui/themes";
import iconStyles from "./LootIcon.module.css";

interface LootIconStyles {
    override?: string;
}

interface LootIconProps {
    category: string;
    color: string;
    icon: string;
    selected?: boolean;
    /**
     * Draw the sprite bare: no white face, no border, no corner notch. For slots
     * that carry the item's rarity themselves via a tinted emboss (the Blacksmith
     * forge line), where a second face and outline would double up on the slot's.
     */
    bare?: boolean;
    styles?: LootIconStyles;
}

const LootIcon: React.FC<LootIconProps> = ({
    category,
    color,
    icon,
    selected,
    bare,
    styles = {},
}) => {
    // The optional `override` is a raw "property: value" CSS declaration with a
    // dynamic property *name*, so it can't be a CSS variable — parse it into an
    // inline style entry (camel-casing the property for React).
    const overrideStyle: React.CSSProperties = {};
    if (styles.override) {
        const [prop, ...rest] = styles.override.split(":");
        const value = rest.join(":").replace(/;/g, "").trim();
        const camel = prop.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        (overrideStyle as Record<string, string>)[camel] = value;
    }

    return (
        <img
            className={`${iconStyles.styledLootIcon} ${bare ? iconStyles.bare : ""}`}
            src={`graphics/images/loot/${category}/${icon}.png`}
            alt="Loot!"
            style={
                {
                    "--loot-border": selected ? "red" : color,
                    // Every icon is the shared square tile (the equipment-slot size)
                    // so all screens match.
                    width: `${ICON_TILE}px`,
                    height: `${ICON_TILE}px`,
                    ...overrideStyle,
                } as React.CSSProperties
            }
        />
    );
};

export default LootIcon;
