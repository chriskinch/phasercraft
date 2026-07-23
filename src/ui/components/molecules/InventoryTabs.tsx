import React, { useState } from "react";
import Button from "@components/Button";
import GearGrid from "./GearGrid";
import ComponentsPanel from "./ComponentsPanel";
import styles from "./InventoryTabs.module.css";

type Tab = "gear" | "components";

// Splits the inventory into Gear | Components tabs. Gear keeps drag-to-equip;
// Components is the stacked, non-draggable grid. Each tab paginates itself.
const InventoryTabs: React.FC = () => {
    const [tab, setTab] = useState<Tab>("gear");

    return (
        <div className={styles.tabs}>
            <div className={styles.tabBar} role="tablist">
                <Button text="Gear" size={1} on={tab === "gear"} onClick={() => setTab("gear")} />
                <Button
                    text="Components"
                    size={1}
                    on={tab === "components"}
                    onClick={() => setTab("components")}
                />
            </div>
            <div className={styles.panel}>
                {tab === "gear" ? <GearGrid /> : <ComponentsPanel />}
            </div>
        </div>
    );
};

export default InventoryTabs;
