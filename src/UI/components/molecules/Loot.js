import React from "react"
import "styled-components/macro"
import LootIcon from "@atoms/LootIcon"
import Tooltip from "./Tooltip"

const Loot = ({loot, loot: {id, isSelected}, setSelected}) => {
    return (
        <>
            <Tooltip id={id} loot={loot} />
            <div
                data-tip
                data-for={id}
                onClick={setSelected ? () => setSelected() : null}
                onContextMenu={(e)=> e.preventDefault()}
                css={'line-height: 0;'}
            >
                <LootIcon {...loot} selected={isSelected} />
            </div>
        </>
    );
};

export default Loot;