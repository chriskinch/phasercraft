import React from "react";
import { pixelEmbossVars } from "@ui/themes";
import theme from "@ui/themes.module.css";
import styles from "./AbilitySlot.module.css";

// Selected slot: the emboss tinted with the active-tab blue (#44bff7).
const SELECTED_RGB = "68,191,247";

interface AbilitySlotProps {
    // Accessible name, e.g. "Slot 1: Fireball".
    label: string;
    selected?: boolean;
    onClick?: () => void;
    // The slot's content (a bare SpellIcon); empty slots show "+".
    children?: React.ReactNode;
    // Purple "New" pill, top-left (picker: learned but not yet looked at).
    isNew?: boolean;
    // Black count-style pill, bottom-right (picker: the slot number a spell
    // already sits in). Decorative; fold its meaning into `label`.
    badge?: string;
}

// An ability slot: the Equipment slot's emboss look (56px footprint, see
// DroppableSlot) as a tappable button.
export const AbilitySlot: React.FC<AbilitySlotProps> = ({
    label,
    selected,
    onClick,
    children,
    isNew,
    badge,
}) => (
    <button
        type="button"
        className={`${theme.pixelEmboss} ${styles.slot}`}
        style={selected ? pixelEmbossVars({ rgb: SELECTED_RGB, a: 0.3 }) : undefined}
        aria-label={label}
        aria-pressed={selected ?? false}
        onClick={onClick}
    >
        {children ?? <span className={styles.plus}>+</span>}
        {isNew && (
            <span className={styles.newPill} aria-hidden="true">
                New
            </span>
        )}
        {badge && (
            <span className={styles.badge} aria-hidden="true">
                {badge}
            </span>
        )}
    </button>
);

// A locked slot (passives, "coming soon"): faded emboss with a pixel padlock.
// Not interactive.
export const LockedSlot: React.FC = () => (
    <div
        className={`${theme.pixelEmboss} ${styles.slot} ${styles.locked}`}
        data-testid="locked-slot"
    >
        <svg
            width="16"
            height="18"
            viewBox="0 0 8 9"
            fill="currentColor"
            role="img"
            aria-label="Locked"
            shapeRendering="crispEdges"
        >
            <rect x="2" y="0" width="4" height="1" />
            <rect x="1" y="1" width="1" height="3" />
            <rect x="6" y="1" width="1" height="3" />
            <rect x="0" y="4" width="8" height="5" />
        </svg>
    </div>
);

export default AbilitySlot;
