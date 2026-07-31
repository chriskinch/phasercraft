import { v4 as uuid } from "uuid";
import sample from "lodash/sample";
import findKey from "lodash/findKey";
import random from "lodash/random";
import { conversionFor, roundStat, type StatFormat } from "@/lib/statConversion";

interface ItemConfig {
    base: number;
    multiplier: number;
    keys: {
        min: number;
        max: number;
    };
    [key: string]: unknown;
}

interface StatInfo {
    value: number;
    done: boolean;
    key: string;
}

interface AdjustedStat {
    adjusted: number;
    format: string;
    label: string;
    short: string;
    abr: string;
    key?: string;
    value?: number;
}

interface StatIterator {
    next: (key: string) => StatInfo;
}

class Item {
    public base!: number;
    public multiplier!: number;
    public keys!: { min: number; max: number };
    public stat_pool: number;
    public stats: { [key: string]: AdjustedStat };
    public info: Record<string, unknown>;
    public category: string;
    public icon: string;
    public set: string;
    public uuid: string;

    constructor(config: ItemConfig) {
        Object.assign(this, config);

        const stat_names = [
            "attack_power",
            "attack_speed",
            "magic_power",
            "critical_chance",
            "speed",
            "defence",
            "health_max",
            "health_regen_rate",
            "health_regen_value",
        ];

        this.stat_pool = this.generateStatPool(this.base);
        const keys = [...new Set(this.generateKeys(this.keys, stat_names))];

        const it = this.allocateStatIterator(this.stat_pool, keys.length);
        this.stats = {};
        this.info = {};
        keys.forEach((key, i) => {
            const stat = it.next(key);
            const converted = this.adjustStats(stat);
            const normalised = this.round(converted);
            // this.stats[key] = normalised.rounded;
            this.stats[key] = normalised;
        });
        this.category = this.getCategory();
        this.icon = this.getIcon(this.category);
        this.set = this.getSet(this.category);

        this.uuid = uuid();
    }

    round(stat: AdjustedStat): AdjustedStat {
        return {
            ...stat,
            rounded: roundStat(stat.adjusted, stat.format as StatFormat),
        } as AdjustedStat;
    }

    generateStatPool(base: number): number {
        const wave = 1;
        const adjustor = wave * this.multiplier;
        return Math.round(random(base + adjustor, base * 2 + adjustor) * random(1, 1.3));
    }

    generateKeys(keys: { min: number; max: number }, stat_names: string[]): string[] {
        const n = random(keys.min, keys.max);
        return Array.from({ length: n }, () => sample(stat_names) as string);
    }

    allocateStatIterator(pool: number, length: number): StatIterator {
        let count = 0;
        let poolRef = pool;

        const statIterator = {
            next: (key: string): StatInfo => {
                const range = 1 / (length * 2); // E.g 2 stats = 50% mid way so range is from 25% to 75%.
                const deduction = Math.round(poolRef * random(range, range * 3)); // Percentage of lower to upper range.
                if (count < length - 1) {
                    poolRef -= deduction;
                    count++;
                    return { value: deduction, done: false, key };
                }
                return { value: poolRef, done: true, key };
            },
        };
        return statIterator;
    }

    adjustStats(stat: StatInfo): AdjustedStat {
        const { convert, format, label, short, abr } = conversionFor(stat.key);
        return { ...stat, adjusted: convert(stat.value), format, label, short, abr };
    }

    getIcon(category: string): string {
        const max: { [key: string]: number } = {
            amulet: 3,
            armor: 30,
            axe: 40,
            bow: 6,
            gem: 10,
            helmet: 50,
            misc: 12,
            staff: 3,
            sword: 24,
        };

        return `${category}_${random(1, max[category])}`;
    }

    getCategory(): string {
        return sample([
            "amulet",
            "armor",
            "axe",
            "bow",
            "gem",
            "helmet",
            "misc",
            "staff",
            "sword",
        ]) as string;
    }

    getSet(category: string): string {
        const sets: { [key: string]: string[] } = {
            amulet: ["amulet", "gem", "misc"],
            body: ["armor"],
            helm: ["helmet"],
            weapon: ["axe", "bow", "staff", "sword"],
        };
        return findKey(sets, (c) => c.includes(category)) as string;
    }
}

export default Item;
