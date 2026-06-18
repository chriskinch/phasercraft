import React from "react";

import Loot from "@components/Loot";
import { pixelEmbossVars } from "@ui/themes";
import theme from "@ui/themes.module.css";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import { unequipLoot } from "@store/gameReducer";
import type { LootItem } from "@/types/game";
import styles from "./DroppableSlot.module.css";

interface DroppableSlotProps {
    loot?: LootItem | null;
    slot: string;
    unequipLoot: (loot: LootItem) => void;
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({ loot, slot, unequipLoot }) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: slot,
        drop: () => ({ slot: slot }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const isActive = canDrop && isOver;
    const rgb = isActive ? "0,100,0" : canDrop ? "100,100,0" : undefined;
    const a = isActive || canDrop ? 0.3 : undefined;

    return (
        <div
            ref={(node) => {
                drop(node);
            }}
            className={`${theme.pixelEmboss} ${styles.droppableSlot}`}
            style={pixelEmbossVars({ rgb, a })}
            data-testid="droppable-slot"
            onClick={() => loot && unequipLoot(loot)}
        >
            {loot && <Loot loot={loot} />}
        </div>
    );
};

export default connect(null, { unequipLoot })(DroppableSlot);
