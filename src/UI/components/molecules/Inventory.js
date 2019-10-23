import React from "react";
import 'styled-components/macro';
import { pixel_emboss } from '../../themes';
import Loot from '../atoms/Loot';

const Inventory = () => {
    // Max inventory space is 12
    const items = new Array(16);
    // Temp: FILL WITH LOOT!
    items.fill(<Loot />);

    return (
        <div css={`
            ${ pixel_emboss }
            align-items: center;
            box-sizing: border-box;
            display: grid;
            grid-gap: 1rem;
            grid-template-columns: auto auto auto auto;
            height: 100%;
            padding: 0 1em;
            margin: 0;
            text-align: center;
            width: 100%;
        `}>
            { items &&
                items.map((item, i) => <div key={i}>{item}</div>)
            }
        </div>
    );
}

export default Inventory;