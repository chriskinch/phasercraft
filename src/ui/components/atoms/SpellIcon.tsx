import React from "react";
import iconAtlas from "../../../../public/graphics/atlas/atlas-icons.json";
import styles from "./SpellIcon.module.css";

interface AtlasFrame {
    filename: string;
    frame: { x: number; y: number; w: number; h: number };
}

// Frame rects of the `atlas-icons` sheet the HUD draws spell buttons from
// (LoadScene loads the same PNG + JSON into Phaser). The frames are not on a
// fixed grid (some are 28–30px wide), so offsets come from the atlas data
// rather than the frame index.
const FRAMES: ReadonlyMap<string, AtlasFrame["frame"]> = new Map(
    (iconAtlas.frames as AtlasFrame[]).map((f) => [f.filename, f.frame])
);

// Relative, like LootIcon's image paths, so it follows the deploy base path.
const ATLAS_URL = "graphics/atlas/atlas-icons.png";

interface SpellIconProps {
    // An `atlas-icons` frame name (SPELL_DEFS[spell].icon_name).
    icon: string;
    // Accessible name; omit for a decorative icon.
    label?: string;
}

// A bare spell icon: the spell's HUD art at its native 32px — no face, border
// or numbers — drawn as a CSS sprite off the shared icon atlas.
const SpellIcon: React.FC<SpellIconProps> = ({ icon, label }) => {
    const frame = FRAMES.get(icon);
    if (!frame) return null;
    return (
        <span
            className={styles.spellIcon}
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            data-icon={icon}
            style={{
                width: `${frame.w}px`,
                height: `${frame.h}px`,
                backgroundImage: `url(${ATLAS_URL})`,
                backgroundPosition: `-${frame.x}px -${frame.y}px`,
            }}
        />
    );
};

export default SpellIcon;
