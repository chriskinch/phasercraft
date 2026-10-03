import React from "react";
import { useSelector } from "react-redux";
import ScrollIcon from "@components/ScrollIcon";
import ScrollTooltip from "./ScrollTooltip";
import PaginationControls from "@components/PaginationControls";
import { usePagination, useMeasuredPageSize } from "@ui/hooks/usePagination";
import { SPELL_DEFS } from "@/types/game";
import { scrollStacks, scrollStatus } from "@/lib/scrollStatus";
import type { RootState } from "@store";
import { ICON_TILE, ICON_TILE_GAP } from "@ui/themes";
// Same tiles and count badge as the Parts grid.
import styles from "./ComponentsGrid.module.css";

const FALLBACK = 12;

interface ScrollsGridProps {
    // Controlled selection (a `scrollKey`); the Equipment screen owns it because
    // the Learn / Sell buttons act on it.
    selectedKey: string | null;
    onSelect: (key: string) => void;
}

// The inventory's Scrolls tab: one tile per spell + level held, with a count
// badge and a tooltip carrying the readability hint.
const ScrollsGrid: React.FC<ScrollsGridProps> = ({ selectedKey, onSelect }) => {
    const { scrolls, character, learnedSpells, abilityLoadout, resource } = useSelector(
        (state: RootState) => ({
            scrolls: state.game.scrolls,
            character: state.game.character,
            learnedSpells: state.game.learnedSpells,
            abilityLoadout: state.game.abilityLoadout,
            resource: state.game.stats.resource_type,
        }),
        (a, b) =>
            a.scrolls === b.scrolls &&
            a.character === b.character &&
            a.learnedSpells === b.learnedSpells &&
            a.abilityLoadout === b.abilityLoadout &&
            a.resource === b.resource
    );
    const stacks = scrollStacks(scrolls);

    const { ref, cols, pageSize } = useMeasuredPageSize(
        ICON_TILE,
        ICON_TILE,
        ICON_TILE_GAP,
        FALLBACK
    );
    const { pageItems, page, pageCount, hasPrev, hasNext, next, prev } = usePagination(
        stacks,
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
                        // Lets ScrollTooltip cap its width to the box (100cqw).
                        containerType: "inline-size",
                    } as React.CSSProperties
                }
                data-testid="scrolls-grid"
            >
                {pageItems.map(({ key, spell, level, count }, i) => {
                    // Open the card inward: left-half columns align its left edge to
                    // the tile, right-half its right edge; an odd grid's middle centres.
                    const col = i % cols;
                    const mid = (cols - 1) / 2;
                    const place = col < mid ? "top-start" : col > mid ? "top-end" : "top";
                    const isSelected = key === selectedKey;
                    const tooltipId = `scroll-${key}`;
                    const status = scrollStatus(
                        { character, learnedSpells, abilityLoadout },
                        spell,
                        level
                    );
                    return (
                        <React.Fragment key={key}>
                            <ScrollTooltip
                                id={tooltipId}
                                spell={spell}
                                level={level}
                                status={status}
                                resource={resource}
                                place={place}
                            />
                            <button
                                type="button"
                                data-tooltip-id={tooltipId}
                                className={styles.slot}
                                onContextMenu={(e) => e.preventDefault()}
                                aria-pressed={isSelected}
                                aria-label={`${SPELL_DEFS[spell].name} Scroll L${level} ×${count}`}
                                onClick={() => onSelect(key)}
                            >
                                <ScrollIcon spell={spell} level={level} selected={isSelected} />
                                <span className={styles.badge}>{count}</span>
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

export default ScrollsGrid;
