import React from "react"
import "styled-components/macro"
import Loot from "@molecules/Loot"
import { selectLootVar } from "@root/cache"

const Stock = ({cols=4, list}) => {
    const items = list.map(item => 
        <Loot 
            loot={item}
            setSelected={() => { selectLootVar(item) }}
            key={item.id}
        />
    );

    return (
        <div 
            css={`
                display: grid;
                grid-template-columns: repeat(${cols}, 1fr);
                grid-gap: 0.5em;
                height: calc(100vh - 158px);
                overflow-y: scroll;
            `}
        >
            { items }
        </div>
    );
}

export default Stock;