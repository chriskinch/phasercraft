import React from "react";
import { useSelector } from "react-redux";
import LootIcon from "@components/LootIcon";
import SpecialTooltip from "./SpecialTooltip";
import PaginationControls from "@components/PaginationControls";
import { usePagination, useMeasuredPageSize } from "@ui/hooks/usePagination";
import { SPECIAL_ITEMS } from "@/types/game";
import { colorForQuality } from "@/lib/armoryClient";
import { specialBonusRow } from "@/lib/specialBonus";
import type { RootState } from "@store";
import { ICON_TILE, ICON_TILE_GAP } from "@ui/themes";
// Same tiles and count badge as the Parts grid.
import styles from "./ComponentsGrid.module.css";

const FALLBACK = 12;

// The inventory's Special tab: owned special items (Blacksmith Step 4d), one
// tile per item with its count. Display only — specials are used at the
// Blacksmith, not sold — so each tile names the item and its bonus on hover.
const SpecialsGrid: React.FC = () => {
    const specials = useSelector((state: RootState) => state.game.specials);
    const owned = SPECIAL_ITEMS.filter((s) => (specials[s.id] ?? 0) > 0);

    const { ref, cols, pageSize } = useMeasuredPageSize(
        ICON_TILE,
        ICON_TILE,
        ICON_TILE_GAP,
        FALLBACK
    );
    const { pageItems, page, pageCount, hasPrev, hasNext, next, prev } = usePagination(
        owned,
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
                data-testid="specials-grid"
            >
                {pageItems.map((special) => {
                    const bonus = specialBonusRow(special);
                    const label = `${special.name} ×${specials[special.id]}: ${bonus.display} ${bonus.label}`;
                    const tooltipId = `special-${special.id}`;
                    return (
                        <React.Fragment key={special.id}>
                            <SpecialTooltip id={tooltipId} special={special} />
                            <div
                                data-tooltip-id={tooltipId}
                                className={styles.slot}
                                role="img"
                                aria-label={label}
                            >
                                <LootIcon
                                    category="misc"
                                    color={colorForQuality(special.quality)}
                                    icon={special.icon}
                                />
                                <span className={styles.badge}>{specials[special.id]}</span>
                            </div>
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

export default SpecialsGrid;
