// Types
export interface LootItem {
    __typename: string;
    id: string;
    category: string;
    color: string;
    icon: string;
    set: string;
    uuid: string;
    stats: LootStat[];
    cost: number;
    name: string;
}

export interface LootStat {
    name: string;
    value: number;
    id: string;
    adjusted?: number;
    rounded?: number;
    formatted?: string;
    polarity?: number;
    abbreviation?: string;
}