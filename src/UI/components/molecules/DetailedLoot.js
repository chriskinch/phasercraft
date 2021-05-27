import React from "react"
import "styled-components/macro"
import LootIcon from "@atoms/LootIcon"
import Stats from "@molecules/Stats"

const DetailedLoot = ({id, loot, compare}) => {
    return (
        <div css={`
            display: flex;
            align-items: start;
            background: white;
            padding: 0.25em;
            border: 3px solid #333;
            border-radius: 0.25em;
        `}>
            <LootIcon {...loot} id={id} styles={{width:16, override:'margin-right:0.5em;'}} />
            <Stats info={loot.info} stats={loot.stats} compare={compare} styles={{width:'100%'}} />
        </div>
    );
};

export default DetailedLoot;