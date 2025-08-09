import React from "react";
import store from "@store";
import LootListDrag from "@components/LootListDrag";

const Inventory: React.FC = () => {
  const inventory = store.getState().game.inventory;
  return (
    <LootListDrag list={inventory} name={"inventory"} />
  );
};

export default Inventory;