import React from "react";

import Loot from "@components/Loot";
import { pixel_emboss } from "@ui/themes";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import { unequipLoot } from "@store/gameReducer";
import type { LootItem } from "@/types/game";

interface DroppableSlotProps {
  loot?: LootItem | null;
  slot: string;
  unequipLoot: (loot: LootItem) => void;
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({ loot, slot, unequipLoot }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: slot,
    drop: () => ({ slot: slot }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  
  const isActive = canDrop && isOver;
  const rgb = (isActive) ? '0,100,0' : (canDrop) ? '100,100,0' : undefined;
  const a = (isActive || canDrop) ? 0.3 : undefined;

  return (
    <div 
      ref={drop as any}
      className={"droppable-slot"}
      onClick={() => loot && unequipLoot(loot)}
    >
      {loot && <Loot loot={loot} />}

      <style jsx>{`
        .droppable-slot {
          ${pixel_emboss({rgb: rgb, a: a})}
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
};

export default connect(null, { unequipLoot })(DroppableSlot);