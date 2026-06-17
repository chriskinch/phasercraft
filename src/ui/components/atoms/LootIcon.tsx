import React from "react";
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
    const overrideStyle: React.CSSProperties = {};
    if (styles.override) {
        const [prop, ...rest] = styles.override.split(":");
        const value = rest.join(":").replace(/;/g, "").trim();
        const camel = prop.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        (overrideStyle as Record<string, string>)[camel] = value;
    }

    return (
        <img
            className={iconStyles.styledLootIcon}
            src={`graphics/images/loot/${category}/${icon}.png`}
            alt="Loot!"
            style={
                {
                    "--loot-border": selected ? "red" : color,
                    width: `${styles.width || 24}px`,
                    ...overrideStyle,
                } as React.CSSProperties
            }
        />
    );
};

export default LootIcon;
