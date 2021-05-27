import React from "react"
import "styled-components/macro"
import Loot from "@molecules/Loot"
import { pixel_emboss } from "@UI/themes"
import { useDrop } from "react-dnd"
import { lootMutations } from "@mutations"

const DroppableSlot = ({loot, slot}) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: slot,
        drop: () => ({ slot: slot }),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })
    const isActive = canDrop && isOver
    const rgb = (isActive) ? '0,100,0' : (canDrop) ? '100,100,0' : undefined;
    const a = (isActive || canDrop) ? 0.3 : undefined;

    return (
        <div 
            ref={drop}
            css={`
                ${pixel_emboss({rgb: rgb, a: a})}
                text-transform: capitalize;
            `}
            onClick={() => { lootMutations.unequipLoot(loot) }}
        >
            { loot && <Loot loot={loot} /> }
        </div>
    );
}

export default DroppableSlot;