import React from "react";
import 'styled-components/macro';

const Loot = () => {
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

    // TODO: Better way to ransomise loot
    const type = loot[Math.floor(Math.random() * Object.keys(loot).length)];
    const name = Object.keys(type)[0];
    const num = Math.floor(Math.random() * Object.values(type)[0]) + 1;

    return (
        <img src={`graphics/images/loot/${name}/${name}_${num}.png`} />
    );
}

export default Loot;