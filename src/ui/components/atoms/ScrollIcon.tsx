import React from "react";
import type { SpellType } from "@entities/Spells/AssignSpell";
import type { SpellLevel } from "@/types/game";
import {
    ATLAS_GUTTER,
    ATLAS_IMAGE,
    SCROLL_FRAME,
    SCROLL_SPELLS,
    scrollFrameKey,
} from "@helpers/scrollSprites";
import { ICON_TILE } from "@ui/themes";
import styles from "./ScrollIcon.module.css";

// Card/tooltip border per scroll level (spec: L1 grey, L2 fine green, L3 rare blue).
export const SCROLL_LEVEL_COLORS: Record<SpellLevel, string> = {
    1: "#bbbbbb",
    2: "#00dd00",
    3: "#0077ff",
};

// The atlas is one column per spell (sorted) and one row per level, with a gutter
// between frames: the layout `buildScrollAtlas` writes and its test pins against
// the committed scrolls.json, so the frame offset is derived rather than fetched.
const STEP = SCROLL_FRAME + ATLAS_GUTTER;
// Centre the 45px sprite in the 56px tile; the tile's inset border paints over
// the sprite's outermost pixel, like LootIcon's art inside its border.
const INSET = Math.floor((ICON_TILE - SCROLL_FRAME) / 2);

interface ScrollIconProps {
    spell: SpellType;
    level: SpellLevel;
    selected?: boolean;
}

// A scroll item tile: LootIcon's white notched face and border (border = level
// colour, red when selected) with the spell × level scroll sprite from the atlas.
const ScrollIcon: React.FC<ScrollIconProps> = ({ spell, level, selected }) => {
    const x = SCROLL_SPELLS.indexOf(spell) * STEP;
    const y = (level - 1) * STEP;
    return (
        <span
            className={styles.scrollIcon}
            data-frame={scrollFrameKey(spell, level)}
            style={
                {
                    "--loot-border": selected ? "red" : SCROLL_LEVEL_COLORS[level],
                    width: `${ICON_TILE}px`,
                    height: `${ICON_TILE}px`,
                    backgroundImage: `url(graphics/atlas/${ATLAS_IMAGE})`,
                    backgroundPosition: `${INSET - x}px ${INSET - y}px`,
                } as React.CSSProperties
            }
        />
    );
};

export default ScrollIcon;
