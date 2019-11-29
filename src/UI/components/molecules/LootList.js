import React, { useState } from "react"
import "styled-components/macro"
import { useDrop } from "react-dnd"
import Loot from "../molecules/Loot"

const LootList = ({cols=4, list, name}) => {
    const [selected, setSelected] = useState(null);
    console.log("LIST: ", selected)

    const [, drop] = useDrop({
        accept: ["amulet", "body", "helm", "weapon"],
        drop: () => ({ slot: name })
    })

    return (
        <div 
            ref={drop}
            css={`
                display: grid;
                grid-template-columns: repeat(${cols}, 1fr);
                grid-template-rows: min-content min-content min-content min-content;
                height: calc(100vh - 145px);
                width: 100%;
                overflow-y: scroll;
            `}
        >
            { list &&
                list.map((loot, i) => {
                    const isSeletced = (selected === i) ? true : false;
                    console.log("MAP: ", isSeletced)
                    return <Loot loot={loot} isSeletced={isSeletced} setSelected={() => setSelected(i)} key={i} id={i.toString()} />
                })
            }
        </div>
    );
}

export default LootList;