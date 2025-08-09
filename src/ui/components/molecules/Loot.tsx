import React from "react";

import LootIcon from "@components/LootIcon";
import ItemTooltip from "./ItemTooltip";
import type { LootItem } from "@/types/game";


interface LootProps {
  loot: LootItem & {isHidden?: boolean }; // Allow for optional isHidden property
  isSelected?: boolean;
  setSelected?: () => void;
}

const Loot: React.FC<LootProps> = ({ loot, loot: { id }, isSelected, setSelected }) => {
  if (loot.isHidden) return null;
  
  return (
    <>
      <ItemTooltip id={id} loot={loot} />
      <div
        data-tooltip-id={id}
        onClick={setSelected ? () => setSelected() : undefined}
        onContextMenu={(e) => e.preventDefault()}
        className="leading-none"
      >
        <LootIcon {...loot} selected={isSelected} />
      </div>
    </>
  );
};

export default Loot;