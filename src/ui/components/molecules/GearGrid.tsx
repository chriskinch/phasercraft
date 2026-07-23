import React from "react";
import { useSelector } from "react-redux";
import LootListDrag from "@components/LootListDrag";
import PaginationControls from "@components/PaginationControls";
import { usePagination, useMeasuredPageSize } from "@ui/hooks/usePagination";
import type { RootState } from "@store";
import styles from "./GearGrid.module.css";

// Match ComponentsGrid so both tabs feel consistent.
const CELL = 44;
const GAP = 16;
const FALLBACK = 12;

// The gear inventory (post-overhaul `inventory` holds only equippable gear —
// components live in their own slice), paginated and still drag-to-equip via
// the existing LootListDrag.
const GearGrid: React.FC = () => {
    const inventory = useSelector((state: RootState) => state.game.inventory);
    const { ref, cols, pageSize } = useMeasuredPageSize(CELL, CELL, GAP, FALLBACK);
    const { pageItems, page, pageCount, hasPrev, hasNext, next, prev } = usePagination(
        inventory,
        pageSize
    );

    return (
        <div className={styles.panel}>
            <div ref={ref} className={styles.gridArea}>
                <LootListDrag list={pageItems} cols={cols} name="inventory" />
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

export default GearGrid;
