import React from "react"
import "styled-components/macro"
import LootIcon from "@atoms/LootIcon"
import Tooltip from "./Tooltip"

const Loot = ({id, loot, isSelected, setSelected}) => {
    if(loot.isHidden) return null;
    return (
        <>
            <Tooltip id={id} loot={loot} />
            <div data-tip data-for={id} onClick={ setSelected ? () => setSelected() : null } css={'line-height: 0;'}>
                <LootIcon {...loot} id={id} selected={isSelected} />
            </div>
        </>
    );
};

export default Loot;