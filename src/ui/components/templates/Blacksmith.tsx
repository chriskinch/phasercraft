import React from "react";
import styles from "./Blacksmith.module.css";

// Skeleton shop (Phase 13, Step 1): opens/closes from the town Blacksmith POI.
// The recipe-based crafting mechanic lands in a later step.
const Blacksmith: React.FC = () => {
    return (
        <div className={styles.container}>
            <section>
                <h2>Blacksmith</h2>
            </section>
        </div>
    );
};

export default Blacksmith;
