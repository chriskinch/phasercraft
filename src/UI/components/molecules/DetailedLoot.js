import React from "react"

import LootIcon from "@components/LootIcon"
import Stats from "@components/Stats"

const DetailedLoot = ({id, loot, compare}) => {
    return (
        <div className="detailed-loot-container">
            <LootIcon {...loot} id={id} styles={{width:16, override:'margin-right:0.5em;'}} />
            <Stats info={loot.info} compare={compare} styles={{width:'100%'}}>{ loot.stats }</Stats>
            
            <style jsx>{`
                .detailed-loot-container {
                    display: flex;
                    align-items: flex-start;
                    background-color: white;
                    padding: 0.25rem;
                    border: 2px solid #1f2937;
                    border-radius: 0.25rem;
                }
            `}</style>
        </div>
    );
};

export default DetailedLoot;