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

// The atlas is one column per spell (sorted) and one row per level, with a gutter
// between frames: the layout `buildScrollAtlas` writes and its test pins against
// the committed scrolls.json, so the frame offset is derived rather than fetched.
const STEP = SCROLL_FRAME + ATLAS_GUTTER;
interface ScrollIconProps {
    spell: SpellType;
    level: SpellLevel;
    selected?: boolean;
}

// A scroll item: the spell × level scroll sprite alone (its tint shows the
// level), with a red outline when selected.
const ScrollIcon: React.FC<ScrollIconProps> = ({ spell, level, selected }) => {
    const x = SCROLL_SPELLS.indexOf(spell) * STEP;
    const y = (level - 1) * STEP;
    return (
        <span
            className={styles.scrollIcon}
            data-frame={scrollFrameKey(spell, level)}
            style={{ width: `${ICON_TILE}px`, height: `${ICON_TILE}px` }}
        >
            {/* Clipped to the 45px frame so the 2px-gutter neighbours never show. */}
            <span
                className={`${styles.sprite} ${selected ? styles.selected : ""}`}
                data-testid="scroll-sprite"
                style={{
                    width: `${SCROLL_FRAME}px`,
                    height: `${SCROLL_FRAME}px`,
                    backgroundImage: `url(graphics/atlas/${ATLAS_IMAGE})`,
                    backgroundPosition: `${-x}px ${-y}px`,
                }}
            />
        </span>
    );
};

export default ScrollIcon;
