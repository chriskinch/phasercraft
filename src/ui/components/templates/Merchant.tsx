import React from "react";
import styles from "./Merchant.module.css";

// Skeleton shop (Phase 13, Step 1): opens/closes from the town Merchant POI.
// Contents (sell gear & parts, buy parts) land in a later step.
const Merchant: React.FC = () => {
    return (
        <div className={styles.container}>
            <section>
                <h2>Merchant</h2>
            </section>
        </div>
    );
};

export default Merchant;
