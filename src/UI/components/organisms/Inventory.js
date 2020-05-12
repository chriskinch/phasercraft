import React from "react"
import store from "@store"
import { pixel_emboss } from "@UI/themes"
import LootListDrag from "@molecules/LootListDrag"
import "styled-components/macro"

const Inventory = () => {
    const inventory = store.getState().inventory;
    return (
        <div css={`
            ${ pixel_emboss }
        `}>
            <LootListDrag list={inventory} name={"inventory"} />
        </div>
    );
}

export default Inventory;