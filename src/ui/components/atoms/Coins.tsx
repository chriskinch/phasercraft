import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@store";
import styles from "./Coins.module.css";

interface CoinsProps {
    // Optional override; by default the live coin balance from the store is shown.
    value?: number;
    // Test/instrumentation hook so callers can target this readout.
    "data-testid"?: string;
}

// The player's coin balance as a coin icon + number, matching the in-game HUD
// coin readout (the one hidden in town). Reused wherever a screen needs to show
// the wallet — the HUD's own copy is a Phaser container, so this is the React
// equivalent using the same coin art.
const Coins: React.FC<CoinsProps> = ({ value, "data-testid": testId }) => {
    const coins = useSelector((state: RootState) => state.game.coins);
    const shown = value ?? coins;

    return (
        <div className={styles.coins} data-testid={testId}>
            <img className={styles.icon} src="./UI/icons/coin.gif" alt="Coins:" />
            <span className={styles.value}>{shown}</span>
        </div>
    );
};

export default Coins;
