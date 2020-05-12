import React from "react"
import "styled-components/macro"
import LootIcon from "@atoms/LootIcon"
import Stats from "@molecules/Stats"

const DetailedLoot = ({id, loot}) => {
    return (
        <div css={`
            display: flex;
            align-items: start;
            background: white;
            padding: 0.25em;
            border: 3px solid #333;
            border-radius: 0.25em;
            margin-bottom: 0.25em;
        `}>
            <LootIcon {...loot} id={id} styles={{override: 'margin-right:0.5em; width:16px;'}} />
            <Stats info={loot.info} styles={{width:'100%'}}>{ loot.stats }</Stats>
        </div>
    );
};

export default DetailedLoot;