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
    // Outer box size in px (border and padding included). When set the icon
    // renders as a square tile with the thicker `.tile` border, e.g. to fill an
    // equipment slot; otherwise `styles.width` sizes the image content.
    size?: number;
    styles?: LootIconStyles;
}

const LootIcon: React.FC<LootIconProps> = ({
    category,
    color,
    icon,
    selected,
    size,
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
