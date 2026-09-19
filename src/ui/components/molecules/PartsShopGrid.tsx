import React from "react";
import { useSelector } from "react-redux";
import LootIcon from "@components/LootIcon";
import PartTooltip from "./PartTooltip";
import { COMPONENT_DEFS, COMPONENT_TYPES, merchantPartsBase } from "@/types/game";
import type { ComponentType } from "@/types/game";
import type { RootState } from "@store";
import styles from "./PartsShopGrid.module.css";

interface PartsShopGridProps {
    selectedType: ComponentType | null;
    onSelectType: (type: ComponentType) => void;
}

// The Merchant's buyable Parts, one icon per component type with a stock badge
// and a price/flavour tooltip. Stock is the wall-clock window's base roll plus
// the run's net sold/bought delta (kept current by the Merchant's refresh tick),
// so it matches exactly what `buyComponent` will allow. A sold-out type (0 in
// stock) is shown greyed and cannot be selected.
const PartsShopGrid: React.FC<PartsShopGridProps> = ({ selectedType, onSelectType }) => {
    const { partsWindow, partsDelta } = useSelector((state: RootState) => state.game.merchant);

    const stockOf = (type: ComponentType) =>
        Math.max(0, merchantPartsBase(partsWindow, type) + (partsDelta[type] ?? 0));

    return (
        <div className={styles.grid} data-testid="parts-shop-grid">
            {COMPONENT_TYPES.map((type) => {
                const def = COMPONENT_DEFS[type];
                const stock = stockOf(type);
                const soldOut = stock <= 0;
                const isSelected = type === selectedType;
                const tooltipId = `part-shop-${type}`;
                return (
                    <React.Fragment key={type}>
                        <PartTooltip id={tooltipId} type={type} />
                        <button
                            type="button"
                            data-tooltip-id={tooltipId}
                            className={styles.slot}
                            aria-pressed={isSelected}
                            aria-label={`${def.name} — ${stock} in stock`}
                            disabled={soldOut}
                            onClick={() => onSelectType(type)}
                        >
                            <LootIcon
                                category="crafting"
                                color="#bbbbbb"
                                icon={def.icon}
                                selected={isSelected}
                            />
                            <span className={styles.badge}>{stock}</span>
                        </button>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default PartsShopGrid;
