import React from "react"

import LootIcon from "@components/LootIcon"
import ItemTooltip from "./ItemTooltip"

const Loot = ({loot, loot: {id}, isSelected, setSelected}) => {
    if(loot.isHidden) return null;
    return (
        <>
            <ItemTooltip id={id} loot={loot} />
            <div
                data-tooltip-id={id}
                onClick={setSelected ? () => setSelected() : null}
                onContextMenu={(e)=> e.preventDefault()}
                className="leading-none"
            >
                <LootIcon {...loot} selected={isSelected} />
            </div>
        </>
    );
};

export default Loot;