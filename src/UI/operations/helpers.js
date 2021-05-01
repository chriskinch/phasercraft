import mergeWith from "lodash/mergeWith"

export const removeStats = (stats, add) => mergeWith(stats, add, (o,s) => o-s);
export const addStats = (stats, add) => mergeWith(stats, add, (o,s) => o+s);
export const statsArrayToObject = stats => stats.reduce((acc, cur) => {
    acc[cur.name] = cur.value;
    return acc;
}, {});
export const sortAscending = key => (a, b) => {
    if(a[key] > b[key]) return 1;
    if(a[key] < b[key]) return -1;
    return 0
};
export const sortDecending = key => (a, b) => {
    if(a[key] < b[key]) return 1;
    if(a[key] > b[key]) return -1;
    return 0
};

export const sortBy = (array, { key, order = "asc" }) => {
    return (order === "asc") ? 
    array.slice().sort(sortAscending(key)) :
    array.slice().sort(sortDecending(key))
}