// const { loot } = action.payload;
// remove(state.loot, (l) => l.uuid === loot.uuid);
// state.inventory.push(loot);
// state.coins -= loot.cost
// state.selected = null;

const createBuyLoot = ({inventoryVar, selectLootVar, coinsVar}) => {
    return () => {
        const selected = selectLootVar();
        const coins = coinsVar();

        if(selected?.cost <= coins) {
            const inventory = inventoryVar();    
            inventoryVar([...inventory, selected]);
            coinsVar(coins - selected.cost);
            selectLootVar(null);
        }else {
            console.log("CANNOT AFFORD!");
        }
    }
}

export default createBuyLoot;