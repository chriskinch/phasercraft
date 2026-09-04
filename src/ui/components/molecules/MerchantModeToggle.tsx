import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMerchantMode } from "@store/gameReducer";
import { pixelBackgroundVars } from "@ui/themes";
import theme from "@ui/themes.module.css";
import type { RootState } from "@store";
import styles from "./MerchantModeToggle.module.css";

// The blue an active Merchant tab uses — matches the Character/Equipment nav tabs.
// Exported so the Merchant panel's Gear/Parts tabs can share the same active blue.
export const MERCHANT_ACTIVE_BLUE = "#44bff7";
const INACTIVE_YELLOW = "#ffa53d";

// The Merchant's Buy/Sell toggle. Rendered in the shared overlay header (to the
// right of the title), so its state lives in the store rather than the Merchant
// panel. Styled as the same pixel-background tabs as the Character/Equipment nav
// tabs: the active side is blue, the inactive side yellow.
const tabStyle = (active: boolean): React.CSSProperties => ({
    ...pixelBackgroundVars({ bg_color: active ? MERCHANT_ACTIVE_BLUE : INACTIVE_YELLOW }),
    color: "white",
    fontSize: "2em",
    // Same spacing the Character/Equipment nav tabs use; clears the pixel-background
    // pseudo-borders that would otherwise make a small flex gap look cramped.
    marginRight: "0.5em",
});

const MerchantModeToggle: React.FC = () => {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.game.merchant.mode);

    return (
        <div
            className={styles.toggle}
            role="tablist"
            aria-label="Buy or sell"
            data-testid="merchant-modes"
        >
            <button
                type="button"
                className={theme.pixelBackground}
                style={tabStyle(mode === "buy")}
                onClick={() => dispatch(setMerchantMode("buy"))}
            >
                Buy
            </button>
            <button
                type="button"
                className={theme.pixelBackground}
                style={tabStyle(mode === "sell")}
                onClick={() => dispatch(setMerchantMode("sell"))}
            >
                Sell
            </button>
        </div>
    );
};

export default MerchantModeToggle;
