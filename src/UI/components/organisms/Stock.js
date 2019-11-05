import React from "react"
import store from "../../../store"
import { pixel_emboss } from "../../themes"
import LootList from "../molecules/LootList"
import "styled-components/macro"

const Stock = () => {
    const stock = store.getState().loot;
    return (
        <div css={`
            ${ pixel_emboss }
            height: 100%;
            padding-top: 2px;
            width: 100%;
        `}>
            <LootList list={stock} name={"stock"} cols={9}/>
        </div>
    );
}

export default Stock;