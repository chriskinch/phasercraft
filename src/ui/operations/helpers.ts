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

// Objects are sorted by a single (string- or number-valued) property; the
// comparison mirrors the original JS `>`/`<` semantics. The generic is left
// unconstrained (callers pass GraphQL items whose runtime sort keys are not on
// their declared type), reading the keyed value through a string-index view.
type Comparable = number | string;

const readKey = (obj: unknown, key: string): Comparable => (obj as Record<string, Comparable>)[key];

export const sortAscending =
    (key: string) =>
    <T>(a: T, b: T): number => {
        const av = readKey(a, key);
        const bv = readKey(b, key);
        if (av > bv) return 1;
        if (av < bv) return -1;
        return 0;
    };

export const sortDescending =
    (key: string) =>
    <T>(a: T, b: T): number => {
        const av = readKey(a, key);
        const bv = readKey(b, key);
        if (av < bv) return 1;
        if (av > bv) return -1;
        return 0;
    };

interface SortOptions {
    key: string;
    order?: "asc" | "desc";
}

export const sortBy = <T>(array: T[], { key, order = "asc" }: SortOptions): T[] => {
    return order === "asc"
        ? array.slice().sort(sortAscending(key))
        : array.slice().sort(sortDescending(key));
};
