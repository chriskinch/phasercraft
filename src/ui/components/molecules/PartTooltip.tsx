import React from "react";
import { Tooltip } from "react-tooltip";
import { COMPONENT_DEFS, componentBuyPrice } from "@/types/game";
import type { ComponentType } from "@/types/game";
import styles from "./PartTooltip.module.css";

interface PartTooltipProps {
    // Tooltip id the anchor references via `data-tooltip-id`.
    id: string;
    type: ComponentType;
}

// Hover card for a buyable part in the Merchant. Shows the part's name, its buy
// price and a short line of flavour text (all from COMPONENT_DEFS) — the buy
// details the plain icon can't convey on its own.
const PartTooltip: React.FC<PartTooltipProps> = ({ id, type }) => {
    const def = COMPONENT_DEFS[type];
    const price = componentBuyPrice(type);

    return (
        <Tooltip
            className={styles.tooltip}
            id={id}
            variant="light"
            globalCloseEvents={{ clickOutsideAnchor: true }}
        >
            <div className={styles.card}>
                <h3 className={styles.title}>{def.name}</h3>
                <div className={styles.price}>
                    <img src="./UI/icons/coin.gif" alt="Price:" /> {price}
                </div>
                <p className={styles.description}>{def.description}</p>
            </div>
        </Tooltip>
    );
};

export default PartTooltip;
