import mergeWith from "lodash/mergeWith"

export const removeStats = (stats, add) => mergeWith(stats, add, (o,s) => o-s);
export const addStats = (stats, add) => mergeWith(stats, add, (o,s) => o+s);
export const statsArrayToObject = stats => stats.reduce((acc, cur) => {
    acc[cur.name] = cur.value;
    return acc;
}, {});