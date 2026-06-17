import React from "react";
import type { LootItem } from "@/types/game";
import styles from "./Slot.module.css";

interface SlotComponentProps {
    loot: LootItem;
    compare?: LootItem;
    id?: string;
}

interface SlotProps {
    loot?: LootItem | null;
    component: React.ComponentType<SlotComponentProps>;
    background?: boolean;
    compare?: LootItem;
}

const Slot: React.FC<SlotProps> = ({ loot, component, background, compare }) => {
    const Component = component;

    return (
        <div className={`${styles.capitalize} ${background ? styles.pixelEmboss : ""}`}>
            {loot && <Component loot={loot} compare={compare} />}
        </div>
    );
};

export default Slot;
