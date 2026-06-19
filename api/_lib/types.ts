export interface AssignedStat {
    id: string;
    name: string;
    value: number;
}

export interface Item {
    id: string;
    createdAt: number;
    name: string;
    category: string;
    set: string | undefined;
    quality: string;
    qualitySort: number;
    cost: number;
    pool: number;
    icon: string;
    stats: AssignedStat[];
}

export interface ItemInput {
    name?: string;
    category?: string;
    cost?: number;
    icon?: string;
    pool?: number;
    quality?: string;
    qualitySort?: number;
    set?: string;
    stats?: Partial<Record<string, number>>;
}
