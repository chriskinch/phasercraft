import React from "react";

import LootIcon from "@components/LootIcon";
import Stats from "@components/Stats";
import type { LootItem } from "@/types/game";
import styles from "./DetailedLoot.module.css";

interface DetailedLootProps {
    id: string;
    loot: LootItem;
    compare?: LootItem;
}

const DetailedLoot: React.FC<DetailedLootProps> = ({ id, loot, compare }) => {
    return (
        <div className={styles.detailedLootContainer}>
            <LootIcon
                category={loot.category || "default"}
                color={loot.color || "#000"}
                icon={loot.icon || "default"}
                styles={{ width: 16, override: "margin-right:0.5em;" }}
            />
            <Stats styles={{ width: "100%" }}>{loot.stats}</Stats>
        </div>
    );
};

export default DetailedLoot;
