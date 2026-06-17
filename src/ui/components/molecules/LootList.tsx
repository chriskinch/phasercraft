import React from "react";

import Loot from "@components/Loot";
import { selectLoot } from "@store/gameReducer";
import { useSelector, useDispatch } from "react-redux";
import type { LootItem } from "@/types/game";
import type { RootState } from "@store";
import styles from "./LootList.module.css";

interface LootListProps {
    name: string;
    cols?: number;
    list: LootItem[];
    selected?: LootItem;
    selectLoot?: (loot: LootItem) => void;
}

const LootList: React.FC<LootListProps> = ({ cols = 4, list }) => {
    const dispatch = useDispatch();
    const selected = useSelector((state: RootState) => state.game.selected);

    const items = [];
    for (const loot of list) {
        // Check for matching selected id
        const isSelected = selected ? selected.id === loot.id : false;
        items.push(
            <Loot
                loot={loot as LootItem}
                isSelected={isSelected}
                setSelected={() => {
                    dispatch(selectLoot(loot));
                }}
                key={loot.id}
            />
        );
    }

    return (
        <div className={styles.lootList} style={{ "--cols": cols } as React.CSSProperties}>
            {list && items}
        </div>
    );
};

export default LootList;
