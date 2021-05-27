import { addStats, statsArrayToObject } from "../helpers"

const createEquipLoot = ({equippedVar, statsVar, baseStatsVar}) => {
    return (loot) => {
        const stats = statsArrayToObject(loot.stats);
        equippedVar({...equippedVar(), [loot.set]: loot});
        baseStatsVar({...addStats(baseStatsVar(), stats)});
        statsVar({...addStats(statsVar(), stats)});
    }
}

export default createEquipLoot;