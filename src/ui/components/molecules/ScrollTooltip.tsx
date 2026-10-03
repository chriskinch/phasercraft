import React from "react";
import { Tooltip } from "react-tooltip";
import { SPELL_DEFS } from "@/types/game";
import type { SpellCost, SpellLevel } from "@/types/game";
import type { SpellType } from "@entities/Spells/AssignSpell";
import type { ScrollStatus } from "@/lib/scrollStatus";
import styles from "./PartTooltip.module.css";
import own from "./ScrollTooltip.module.css";

interface ScrollTooltipProps {
    id: string;
    spell: SpellType;
    level: SpellLevel;
    status: ScrollStatus;
    // The player's resource (mana / rage / energy); cost is shown in it.
    resource?: string;
    // Anchor-relative placement; edge columns open inward so the card stays
    // inside the inventory box.
    place?: "top" | "top-start" | "top-end";
}

const isCostKey = (r: string | undefined): r is keyof SpellCost =>
    r === "mana" || r === "rage" || r === "energy";

// Hover/tap card for a scroll in the Equipment Scrolls tab: name, level and
// classes, effect, cost and cooldown, then the readability hint (purple when
// the scroll can be read, red when not).
const ScrollTooltip: React.FC<ScrollTooltipProps> = ({
    id,
    spell,
    level,
    status,
    resource,
    place = "top",
}) => {
    const def = SPELL_DEFS[spell];
    const costKey = isCostKey(resource) ? resource : "mana";

    return (
        <Tooltip
            className={`${styles.tooltip} ${own.tooltip}`}
            id={id}
            variant="light"
            place={place}
            globalCloseEvents={{ clickOutsideAnchor: true }}
        >
            <div className={styles.card}>
                <h3 className={styles.title}>{def.name} Scroll</h3>
                <p className={own.muted}>
                    Level {level} · {def.classes.join(", ")}
                </p>
                <p className={styles.effect}>{def.effect}</p>
                <p className={own.muted}>
                    Cost {def.cost[costKey]} {costKey} · Cooldown {def.cooldown}s
                </p>
                <p
                    className={`${own.hint} ${status.readable ? own.readable : own.blocked}`}
                    data-testid="scroll-hint"
                >
                    {status.hint}
                </p>
            </div>
        </Tooltip>
    );
};

export default ScrollTooltip;
