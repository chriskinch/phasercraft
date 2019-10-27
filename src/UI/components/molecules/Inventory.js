import React from "react";
import "styled-components/macro";
import { pixel_emboss } from "../../themes";
import Loot from "../molecules/Loot";
import store from "../../../store";

const Inventory = () => {
    const items = store.getState().inventory;

    return (
        <div css={`
            ${ pixel_emboss }
            display: grid;
            grid-template-columns: 25% 25% 25% 25%;
            grid-template-rows: min-content min-content min-content min-content;
            height: 100%;
            width: 100%;
        `}>
            { items && items.map((item, i) => <Loot item={item} key={i} id={i.toString()} />) }
        </div>
    );
}

export default Inventory;