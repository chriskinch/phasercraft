import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMerchantMode } from "@store/gameReducer";
import type { MerchantMode } from "@store/gameReducer";
import HeaderTabs, { HEADER_TAB_ACTIVE } from "./HeaderTabs";
import type { RootState } from "@store";

// The blue an active Merchant tab uses. Exported so the Merchant panel's
// Gear/Parts tabs can share the same active blue.
export const MERCHANT_ACTIVE_BLUE = HEADER_TAB_ACTIVE;

const MODES: { id: MerchantMode; label: string }[] = [
    { id: "buy", label: "Buy" },
    { id: "sell", label: "Sell" },
];

// The Merchant's Buy/Sell toggle, in the shared overlay header.
const MerchantModeToggle: React.FC = () => {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.game.merchant.mode);
    return (
        <HeaderTabs
            tabs={MODES}
            active={mode}
            onSelect={(m) => dispatch(setMerchantMode(m))}
            label="Buy or sell"
            testId="merchant-modes"
        />
    );
};

export default MerchantModeToggle;
