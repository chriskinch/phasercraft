import { InMemoryCache, makeVar } from '@apollo/client';

export const characterVar = makeVar();
export const menuVar = makeVar("save");
export const inventoryVar = makeVar([]);
export const equippedVar = makeVar({
    amulet: null,
    body: null,
    helm: null,
    weapon: null
});
export const selectLootVar = makeVar(null);
export const baseStatsVar = makeVar({});
export const statsVar = makeVar({});
export const coinsVar = makeVar(8888);
export const filtersVar = makeVar([]);

const qualityColors = Object.freeze({
    common: "#bbbbbb",
    fine: "#00dd00",
    rare: "#0077ff",
    epic: "#9900ff",
    legendary: "#ff9900",
});

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                items: {
                    merge(existing, incoming){
                        return incoming;
                    }
                }
            }
        },
        Item: {
            fields: {
                color: {
                    read(_, {readField}) {
                        return qualityColors[readField('quality')];
                    }
                },
                isSelected: {
                    read(_, {readField}) {
                        return selectLootVar()?.id === readField('id');
                    }
                },
                isInInventory: {
                    read(_, {readField}) {
                        return inventoryVar().map(i => i.id).includes(readField('id'));
                    }
                }
            }
        }
    }
});