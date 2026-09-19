import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Loot from "@components/Loot";
import PaginationControls from "@components/PaginationControls";
import { selectLoot } from "@store/gameReducer";
import { usePagination, useMeasuredPageSize } from "@ui/hooks/usePagination";
import type { RootState } from "@store";
import styles from "./GearShopGrid.module.css";

// Match the other inventory grids so the tabs feel consistent.
const CELL = 44;
const GAP = 16;
const FALLBACK = 12;

// The Merchant's buyable Gear — exactly the gear the player has sold this session
// (session-lived, not tied to the parts restock). Non-draggable: each item is a
// tooltip'd icon that selects on click (shared `selected`, same as the sell side),
// and the Merchant's Buy button acts on the selection.
const GearShopGrid: React.FC = () => {
    const dispatch = useDispatch();
    const gearStock = useSelector((state: RootState) => state.game.merchant.gearStock);
    const selected = useSelector((state: RootState) => state.game.selected);
    const { ref, cols, pageSize } = useMeasuredPageSize(CELL, CELL, GAP, FALLBACK);
    const { pageItems, page, pageCount, hasPrev, hasNext, next, prev } = usePagination(
        gearStock,
        pageSize
    );

    return (
        <div className={styles.panel}>
            <div
                ref={ref}
                className={styles.grid}
                style={{ "--cols": cols } as React.CSSProperties}
                data-testid="gear-shop-grid"
            >
                {pageItems.map((loot) => (
                    <Loot
                        key={loot.id}
                        loot={loot}
                        isSelected={selected ? selected.id === loot.id : false}
                        setSelected={() => dispatch(selectLoot(loot))}
                    />
                ))}
            </div>
            <PaginationControls
                page={page}
                pageCount={pageCount}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPrev={prev}
                onNext={next}
            />
        </div>
    );
};

export default GearShopGrid;
