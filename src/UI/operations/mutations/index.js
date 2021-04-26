import createEquipLoot from "./equipLoot";
import createUnequipLoot from "./unequipLoot";
import { equippedVar, statsVar, baseStatsVar } from "@root/cache"

const lootActions = {
  equippedVar,
  statsVar,
  baseStatsVar
}

export const lootMutations = {
  equipLoot: createEquipLoot(lootActions),
  unequipLoot: createUnequipLoot(lootActions),
}