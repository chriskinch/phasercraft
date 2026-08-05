import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@components/Button";
import { setMerchantMode } from "@store/gameReducer";
import type { RootState } from "@store";
import styles from "./MerchantModeToggle.module.css";

// The Merchant's Buy/Sell toggle. Rendered in the shared overlay header (to the
// right of the title), so its state lives in the store rather than the Merchant
// panel. Follows the tab convention: the active side is blue, the inactive side
// the standard yellow.
export const MERCHANT_ACTIVE_BLUE = "#44bff7";

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
            <Button
                text="Buy"
                bg_color={mode === "buy" ? MERCHANT_ACTIVE_BLUE : undefined}
                onClick={() => dispatch(setMerchantMode("buy"))}
            />
            <Button
                text="Sell"
                bg_color={mode === "sell" ? MERCHANT_ACTIVE_BLUE : undefined}
                onClick={() => dispatch(setMerchantMode("sell"))}
            />
        </div>
    );
};

export default MerchantModeToggle;
