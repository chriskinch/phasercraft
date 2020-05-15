import React from "react"
import "styled-components/macro"
import LootIcon from "@atoms/LootIcon"
import Tooltip from "./Tooltip"

const Loot = ({loot, loot: {uuid}, tooltips, isSelected, setSelected}) => {
    if(loot.isHidden) return null;
    return (
        <>
            {tooltips && <Tooltip id={uuid} loot={loot} /> }
            <div data-tip data-for={uuid} onClick={setSelected ? () => setSelected() : null} css={'line-height: 0;'}>
                <LootIcon {...loot} selected={isSelected} />
            </div>
        </>
    );
};

export default Loot;