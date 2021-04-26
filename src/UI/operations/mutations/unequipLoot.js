import { removeStats, statsArrayToObject } from "../helpers"

const createUnequipLoot = ({equippedVar, statsVar, baseStatsVar}) => {
    return (loot) => {
        const stats = statsArrayToObject(loot.stats);
        equippedVar({...equippedVar(), [loot.set]: null});
        baseStatsVar({...removeStats(baseStatsVar(), stats)});
        statsVar({...removeStats(statsVar(), stats)});
    }
}

export default createUnequipLoot;