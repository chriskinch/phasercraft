import React from "react";
import ReactTooltip from 'react-tooltip';
import 'styled-components/macro';
import LootTable from "../../../Entities/Loot/LootTable";
import Stats from "../molecules/Stats";

const Loot = () => {
    const table = new LootTable();
    const loot = [
        { amulet: 3 },
        { armor: 30 },
        { axe: 40 },
        { bow: 6 },
        { gem: 10 },
        { misc: 12 },
        { staff: 3 },
        { sword: 24 }
    ];

    // console.log("UI TABLE: ", table.loot);

    // TODO: Better way to ransomise loot
    const type = loot[Math.floor(Math.random() * Object.keys(loot).length)];
    const name = Object.keys(type)[0];
    const num = Math.floor(Math.random() * Object.values(type)[0]) + 1;

    const item = table.loot[Math.floor(Math.random() * 100)];
    const id = Math.random().toString();
    const color = (item.tier === "legendary") ? "#ff9900" :
        (item.tier === "epic") ? "#9900ff" :
        (item.tier === "rare") ? "#3333ff" :
        (item.tier === "common") ? "#bbbbbb" :
        "#ffffff";

    return (
        <>
            <Tooltip id={id} item={item} />
            <img css={`
                border: 3px solid ${color};
                border-radius: 0.25em;
                padding: 0.25em;
            `} data-tip data-for={id} src={`graphics/images/loot/${name}/${name}_${num}.png`} alt="Loot!" />
        </>
    );
}

export default Loot;