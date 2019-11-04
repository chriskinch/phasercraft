import React from "react"
import "styled-components/macro"
import { pixel_emboss } from "../../themes"
import { useDrop } from "react-dnd"
import Loot from "../molecules/Loot"
import store from "../../../store"

const Inventory = () => {
    const inventory = store.getState().inventory;

    const [, drop] = useDrop({
        accept: ["amulet", "body", "helm", "weapon"],
        drop: () => ({ slot: "inventory" })
    })

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
                inventory.map((loot, i) => <Loot loot={loot} key={i} id={i.toString()} />)
            }
        </div>
    );
}

export default Inventory;