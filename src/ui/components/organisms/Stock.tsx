import React from "react";
import LootList from "@components/LootList";
import type { LootItem } from "@/types/game";

const Stock = ({ items }: { items: LootItem[] }) => {
  return (
    <LootList list={items} name={"stock"} cols={9} />
  );
};

export default Stock;