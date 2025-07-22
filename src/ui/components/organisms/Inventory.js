import React from "react"
import store from "@store"
import LootListDrag from "@components/LootListDrag"


const Inventory = () => {
    const inventory = store.getState().game.inventory;
    return (
        <LootListDrag list={inventory} name={"inventory"} />
    );
}

export default Inventory;