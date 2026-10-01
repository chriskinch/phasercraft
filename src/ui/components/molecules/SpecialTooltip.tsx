import React from "react";
import { Tooltip } from "react-tooltip";
import { colorForQuality } from "@/lib/armoryClient";
import { specialBonusRow } from "@/lib/specialBonus";
import type { SpecialItem } from "@/types/game";
import styles from "./PartTooltip.module.css";

interface SpecialTooltipProps {
    id: string;
    special: SpecialItem;
}

// Hover card for a special item: name and its effect.
const SpecialTooltip: React.FC<SpecialTooltipProps> = ({ id, special }) => {
    const bonus = specialBonusRow(special);

    return (
        <Tooltip
            className={styles.tooltip}
            id={id}
            variant="light"
            globalCloseEvents={{ clickOutsideAnchor: true }}
        >
            <div className={styles.card} style={{ borderColor: colorForQuality(special.quality) }}>
                <h3 className={styles.title}>{special.name}</h3>
                <p className={styles.effect}>
                    {bonus.display} {bonus.label}
                </p>
            </div>
        </Tooltip>
    );
};

export default SpecialTooltip;
