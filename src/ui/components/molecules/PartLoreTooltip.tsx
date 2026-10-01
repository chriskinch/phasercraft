import React from "react";
import { Tooltip } from "react-tooltip";
import { COMPONENT_DEFS } from "@/types/game";
import type { ComponentType } from "@/types/game";
import styles from "./PartTooltip.module.css";

interface PartLoreTooltipProps {
    id: string;
    type: ComponentType;
}

// Hover card for an owned part in the inventory: name plus story flavour text.
const PartLoreTooltip: React.FC<PartLoreTooltipProps> = ({ id, type }) => {
    const def = COMPONENT_DEFS[type];

    return (
        <Tooltip
            className={styles.tooltip}
            id={id}
            variant="light"
            globalCloseEvents={{ clickOutsideAnchor: true }}
        >
            <div className={styles.card}>
                <h3 className={styles.title}>{def.name}</h3>
                <p className={styles.description}>{def.lore}</p>
            </div>
        </Tooltip>
    );
};

export default PartLoreTooltip;
