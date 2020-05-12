import React from "react"
import store from "@store"
import LootListDrag from "@molecules/LootListDrag"
import "styled-components/macro"

const Inventory = () => {
    const inventory = store.getState().inventory;
    return (
        <LootListDrag list={inventory} name={"inventory"} />
    );
}

export default Inventory;