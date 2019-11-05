import React from "react"
import store from "../../../store"
import { pixel_emboss } from "../../themes"
import LootList from "../molecules/LootList"
import "styled-components/macro"

const Inventory = () => {
    const inventory = store.getState().inventory;
    return (
        <div css={`
            ${ pixel_emboss }
            height: 100%;
            padding-top: 0.75em;
            width: 100%;
        `}>
            <LootList list={inventory} name={"inventory"} />
        </div>
    );
}

export default Inventory;