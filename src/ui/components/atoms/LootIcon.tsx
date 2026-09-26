import React from "react";
import { ICON_TILE } from "@ui/themes";
import iconStyles from "./LootIcon.module.css";

interface LootIconStyles {
    width?: number;
    override?: string;
}

interface LootIconProps {
    category: string;
    color: string;
    icon: string;
    selected?: boolean;
    styles?: LootIconStyles;
}

const LootIcon: React.FC<LootIconProps> = ({ category, color, icon, selected, styles = {} }) => {
    // The optional `override` is a raw "property: value" CSS declaration with a
    // dynamic property *name*, so it can't be a CSS variable — parse it into an
    // inline style entry (camel-casing the property for React).
    // Every icon renders as the shared square tile (the equipment-slot size) so
    // gear, parts and shop grids all match. `styles.width` opts out for small
    // inline thumbnails (DetailedLoot), which keep the plain rounded border.
    const size = styles.width ? undefined : ICON_TILE;

    const overrideStyle: React.CSSProperties = {};
    if (styles.override) {
        const [prop, ...rest] = styles.override.split(":");
        const value = rest.join(":").replace(/;/g, "").trim();
        const camel = prop.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        (overrideStyle as Record<string, string>)[camel] = value;
    }

    return (
        <img
            className={`${iconStyles.styledLootIcon} ${size ? iconStyles.tile : ""}`}
            src={`graphics/images/loot/${category}/${icon}.png`}
            alt="Loot!"
            style={
                {
                    "--loot-border": selected ? "red" : color,
                    width: `${size || styles.width || 24}px`,
                    height: size ? `${size}px` : undefined,
                    ...overrideStyle,
                } as React.CSSProperties
            }
        />
    );
};

export default LootIcon;
