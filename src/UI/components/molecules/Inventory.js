import React from "react";
import "styled-components/macro";
import { pixel_emboss } from "../../themes";
import { useDrop } from "react-dnd"
import Loot from "../molecules/Loot";
import store from "../../../store";

const Inventory = () => {
    const inventory = store.getState().inventory;

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ["amulet", "body", "helm", "weapon"],
        drop: () => ({ slot: "inventory" }),
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
                ${ pixel_emboss }
                display: grid;
                grid-template-columns: 25% 25% 25% 25%;
                grid-template-rows: min-content min-content min-content min-content;
                padding-top: 1em;
                height: 100%;
                width: 100%;
            `}
        >
            { inventory &&
                inventory.map((loot, i) => <Loot loot={loot} key={i} id={`item_${i.toString()}`} />)
            }
        </div>
    );
}

export default Inventory;