import createEquipLoot from "./equipLoot";
import createUnequipLoot from "./unequipLoot";
import createBuyLoot from "./buyLoot";
import { inventoryVar, selectLootVar, equippedVar, statsVar, baseStatsVar, coinsVar } from "@root/cache"

const equipUnequipActions = {
  equippedVar,
  statsVar,
  baseStatsVar
}

const buySellActions = {
  inventoryVar,
  selectLootVar,
  coinsVar
}

export const lootMutations = {
  buyLoot: createBuyLoot(buySellActions),
  equipLoot: createEquipLoot(equipUnequipActions),
  unequipLoot: createUnequipLoot(equipUnequipActions),
}