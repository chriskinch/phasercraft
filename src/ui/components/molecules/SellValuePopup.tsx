import React from "react";
import styles from "./SellValuePopup.module.css";

interface SellValuePopupProps {
    // Total coins the current sell would credit (unit value × quantity).
    value: number;
}

// Tooltip-style card pinned to the lower-right corner of an inventory box,
// showing what selling the current selection is worth. The parent must be a
// positioned element (pixelEmboss already is). Reusable for Parts and Scrolls.
const SellValuePopup: React.FC<SellValuePopupProps> = ({ value }) => (
    <div className={styles.popup} data-testid="sell-value">
        <img src="./UI/icons/coin.gif" alt="Sell value:" />
        <span className={styles.value}>+{value}</span>
    </div>
);

export default SellValuePopup;
