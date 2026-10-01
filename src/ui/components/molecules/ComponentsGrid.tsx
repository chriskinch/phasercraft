import React, { useState } from "react";
import { useSelector } from "react-redux";
import LootIcon from "@components/LootIcon";
import PartLoreTooltip from "./PartLoreTooltip";
import PaginationControls from "@components/PaginationControls";
import { usePagination, useMeasuredPageSize } from "@ui/hooks/usePagination";
import { COMPONENT_DEFS } from "@/types/game";
import type { RootState } from "@store";
import { ICON_TILE, ICON_TILE_GAP } from "@ui/themes";
import styles from "./ComponentsGrid.module.css";

// Slot size and gap (shared with the gear grid) derive how many slots fit
// responsively — no placeholder cells.
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

    const { ref, cols, pageSize } = useMeasuredPageSize(
        ICON_TILE,
        ICON_TILE,
        ICON_TILE_GAP,
        FALLBACK
    );
    const { pageItems, page, pageCount, hasPrev, hasNext, next, prev } = usePagination(
        components,
        pageSize
    );

    return (
        <div className={styles.panel}>
            <div
                ref={ref}
                className={styles.grid}
                style={
                    {
                        "--cols": cols,
                        "--cell": `${ICON_TILE}px`,
                        "--gap": `${ICON_TILE_GAP}px`,
                    } as React.CSSProperties
                }
                data-testid="components-grid"
            >
                {pageItems.map((stack) => {
                    const def = COMPONENT_DEFS[stack.type];
                    const isSelected = stack.id === activeId;
                    const tooltipId = `part-lore-${stack.id}`;
                    return (
                        <React.Fragment key={stack.id}>
                            <PartLoreTooltip id={tooltipId} type={stack.type} />
                            <button
                                type="button"
                                data-tooltip-id={tooltipId}
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
                        </React.Fragment>
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
