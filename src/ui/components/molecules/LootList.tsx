import React from "react";

import Loot from "@components/Loot";
import { selectLoot } from "@store/gameReducer";
import { useSelector, useDispatch } from "react-redux";
import type { LootItem } from "@/types/game";
import type { RootState } from "@store";

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
        setSelected={() => { dispatch(selectLoot(loot)); }}
        key={loot.id}
      />
    );
  }
  
  return ( 
    <div className="loot-list">
      {list && items}
      <style jsx>{`
        .loot-list {
          display: grid;
          gap: 0.5rem;
          overflow-y: scroll;
          grid-template-columns: repeat(${cols}, 1fr);
          height: calc(100vh - 158px);
        }
      `}</style>
    </div>
  );
};

export default LootList;