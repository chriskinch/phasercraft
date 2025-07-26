import mergeWith from "lodash/mergeWith";

interface StatObject {
  [key: string]: number;
}

interface StatItem {
  name: string;
  value: number;
}

export const removeStats = (stats: StatObject, add: StatObject): StatObject => 
  mergeWith(stats, add, (o: number, s: number) => o - s);

export const addStats = (stats: StatObject, add: StatObject): StatObject => 
  mergeWith(stats, add, (o: number, s: number) => o + s);

export const statsArrayToObject = (stats: StatItem[]): StatObject => 
  stats.reduce((acc, cur) => {
    acc[cur.name] = cur.value;
    return acc;
  }, {} as StatObject);

export const sortAscending = (key: string) => <T extends Record<string, any>>(a: T, b: T): number => {
  if (a[key] > b[key]) return 1;
  if (a[key] < b[key]) return -1;
  return 0;
};

export const sortDescending = (key: string) => <T extends Record<string, any>>(a: T, b: T): number => {
  if (a[key] < b[key]) return 1;
  if (a[key] > b[key]) return -1;
  return 0;
};

interface SortOptions {
  key: string;
  order?: "asc" | "desc";
}

export const sortBy = <T extends Record<string, any>>(array: T[], { key, order = "asc" }: SortOptions): T[] => {
  return (order === "asc") ? 
    array.slice().sort(sortAscending(key)) :
    array.slice().sort(sortDescending(key));
};