import React, { useEffect } from "react";

import { useDrop, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import Loot from "@components/Loot";
import { useSelector, useDispatch } from "react-redux";
import { equipLoot, selectLoot, unequipLoot } from "@store/gameReducer";
import type { LootItem } from "@/types/game";
import type { RootState } from "@store";

interface LootListDragProps {
  cols?: number;
  list: LootItem[];
  name: string;
}

const LootListDrag: React.FC<LootListDragProps> = ({
  cols = 6,
  list,
  name
}) => {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.game.selected);
  const equipment = useSelector((state: RootState) => state.game.equipment);

  const handleDropResult = (loot: LootItem, set: string) => {
    if (equipment[set as keyof typeof equipment]) dispatch(unequipLoot(equipment[set as keyof typeof equipment]!));
    dispatch(equipLoot(loot));
  };
  // This must go here rather then inside the Loot component due to this bug:
  // https://github.com/react-dnd/react-dnd/issues/1589
  // Wraps the Loot component instead. Means some duplication of code. :(
  const LootDrag: React.FC<{ loot: LootItem; isSelected?: boolean; setSelected: () => void; id: string }> = (props) => {
    const { loot } = props;
    const { category, color, icon, set, uuid } = loot;

    const [{ isDragging }, drag, preview] = useDrag({
      type: set,
      item: { category, color, icon, uuid },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult() as { slot: string } | null;
        if (item && dropResult) {
          switch (dropResult.slot) {
            case "amulet":
            case "body":
            case "helm":
            case "weapon":
              handleDropResult(loot, set);
              break;
            default:
              console.log("Unrecognized slot!");
          }
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      })
    });

    useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    });

    return (
      <div ref={drag as any} className={isDragging ? 'dragging' : ''}>
        <Loot loot={props.loot as any} isSelected={props.isSelected} setSelected={props.setSelected} />
        <style jsx>{`
          .dragging {
            opacity: 0.1;
            filter: grayscale(100%);
          }
        `}</style>
      </div>
    );
  };

  const [, drop] = useDrop({
    accept: ["amulet", "body", "helm", "weapon"],
    drop: () => ({ slot: name })
  });

  return (
    <div 
      ref={drop as any}
      className="loot-grid"
    >
      {list &&
        list.map((loot, i) => {
          // Check for matching selected uuid
          const isSelected = selected ? selected.id === loot.id : false;
          return (
            <LootDrag
              loot={loot}
              isSelected={isSelected}
              setSelected={() => {
                dispatch(selectLoot(loot));
              }}
              key={loot.id}
              id={i.toString()}
            />
          );
        })
      }
      <style jsx>{`
        .loot-grid {
          display: grid;
          gap: 1rem;
          overflow-y: scroll;
          grid-template-columns: repeat(${cols}, 1fr);
        }
      `}</style>
    </div>
  );
};

export default LootListDrag;