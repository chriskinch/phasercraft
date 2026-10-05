import React from "react";
import { pixelBackgroundVars } from "@ui/themes";
import theme from "@ui/themes.module.css";
import styles from "./HeaderTabs.module.css";

// The blue an active header tab uses — matches the Character/Equipment nav tabs.
export const HEADER_TAB_ACTIVE = "#44bff7";
const INACTIVE_YELLOW = "#ffa53d";

// Pixel-background tabs rendered in the shared overlay header beside a shop's
// title (Merchant Buy/Sell, Arcanum Merge/Craft): the active tab is blue, the
// others yellow. Selection lives in the store, since the shop body renders apart.
const tabStyle = (active: boolean): React.CSSProperties => ({
    ...pixelBackgroundVars({ bg_color: active ? HEADER_TAB_ACTIVE : INACTIVE_YELLOW }),
    color: "white",
    fontSize: "2em",
    // Same spacing the Character/Equipment nav tabs use; clears the pixel-background
    // pseudo-borders that would otherwise make a small flex gap look cramped.
    marginRight: "0.5em",
});

interface HeaderTabsProps<T extends string> {
    tabs: readonly { id: T; label: string }[];
    active: T;
    onSelect: (id: T) => void;
    label: string;
    testId?: string;
}

const HeaderTabs = <T extends string>({
    tabs,
    active,
    onSelect,
    label,
    testId,
}: HeaderTabsProps<T>) => (
    <div className={styles.toggle} role="tablist" aria-label={label} data-testid={testId}>
        {tabs.map(({ id, label: text }) => (
            <button
                key={id}
                type="button"
                className={theme.pixelBackground}
                style={tabStyle(active === id)}
                onClick={() => onSelect(id)}
            >
                {text}
            </button>
        ))}
    </div>
);

export default HeaderTabs;
