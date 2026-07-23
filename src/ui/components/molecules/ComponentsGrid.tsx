import React, { useState } from "react";
import { useSelector } from "react-redux";
import LootIcon from "@components/LootIcon";
import PaginationControls from "@components/PaginationControls";
import { usePagination, useMeasuredPageSize } from "@ui/hooks/usePagination";
import { COMPONENT_DEFS } from "@/types/game";
import type { RootState } from "@store";
import styles from "./ComponentsGrid.module.css";

// Approximate on-screen size of one slot (icon + border + padding) and the grid
// gap, used to derive how many slots fit responsively — no placeholder cells.
const CELL = 44;
const GAP = 16;
const FALLBACK = 12;

interface ComponentsGridProps {
    // Optional controlled selection, so a parent (Stage 5's sell controls) can own
    // which stack is selected. Uncontrolled by default: the grid tracks its own.
    selectedId?: string | null;
    onSelectStack?: (id: string) => void;
}

// A non-draggable grid of component stacks. Each slot shows the type icon with a
// quantity badge; clicking selects the stack. Paginated with the shared
// responsive page-size primitive.
const ComponentsGrid: React.FC<ComponentsGridProps> = ({ selectedId, onSelectStack }) => {
    const components = useSelector((state: RootState) => state.game.components);
    const [internalSelected, setInternalSelected] = useState<string | null>(null);

    // Controlled when a `selectedId` prop is passed, otherwise self-managed.
    const activeId = selectedId !== undefined ? selectedId : internalSelected;
    const select = (id: string) => (onSelectStack ? onSelectStack(id) : setInternalSelected(id));

    const { ref, cols, pageSize } = useMeasuredPageSize(CELL, CELL, GAP, FALLBACK);
    const { pageItems, page, pageCount, hasPrev, hasNext, next, prev } = usePagination(
        components,
        pageSize
    );

    return (
        <div className={styles.panel}>
            <div
                ref={ref}
                className={styles.grid}
                style={{ "--cols": cols } as React.CSSProperties}
                data-testid="components-grid"
            >
                {pageItems.map((stack) => {
                    const def = COMPONENT_DEFS[stack.type];
                    const isSelected = stack.id === activeId;
                    return (
                        <button
                            key={stack.id}
                            type="button"
                            className={styles.slot}
                            aria-pressed={isSelected}
                            aria-label={`${def.name} ×${stack.quantity}`}
                            onClick={() => select(stack.id)}
                        >
                            <LootIcon
                                category="crafting"
                                color="#bbbbbb"
                                icon={def.icon}
                                selected={isSelected}
                            />
                            <span className={styles.badge}>{stack.quantity}</span>
                        </button>
                    );
                })}
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

export default ComponentsGrid;
