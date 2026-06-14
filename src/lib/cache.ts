import { InMemoryCache, type FieldReadFunction, type TypePolicies } from "@apollo/client";

const qualityColors: Record<string, string> = Object.freeze({
    common: "#bbbbbb",
    fine: "#00dd00",
    rare: "#0077ff",
    epic: "#9900ff",
    legendary: "#ff9900",
});

const statShortNames: Record<string, string> = Object.freeze({
    attack_power: "AP",
    attack_speed: "AS",
    critical_chance: "C",
    defence: "D",
    health_max: "H",
    health_regen_rate: "RR",
    health_regen_value: "RV",
    magic_power: "MP",
    speed: "S",
});

const adjusted = (key: string | undefined, value: number): number => {
    switch (key) {
        case "attack_power":
            return value / 2;
        case "attack_speed":
            return -value / 1000;
        case "critical_chance":
            return value / 10;
        case "defence":
            return value / 2;
        case "health_max":
            return value * 4;
        case "health_regen_rate":
            return -value / 1000;
        case "health_regen_value":
            return value / 10;
        case "magic_power":
            return value / 2;
        case "speed":
            return value / 10;
        default:
            console.log(`No adjustment for [${key}] found.`);
            return value;
    }
};

const formatted = (key: string | undefined, value: number): string | number => {
    let format: string | number;
    switch (key) {
        // These are rounded percentages (by the way... WTF is EPSILON???)
        case "attack_speed":
        case "critical_chance":
        case "health_regen_rate":
            format = `${Math.ceil((value + Number.EPSILON) * 100) / 100}%`;
            break;
        // Otherwise it's just rounded
        default:
            format = Math.ceil(value);
    }
    return format;
};

const colorRead: FieldReadFunction<string> = (_, { readField }) =>
    qualityColors[readField<string>("quality") as string];

const adjustedRead: FieldReadFunction<number> = (_, { readField }) =>
    adjusted(readField<string>("name"), readField<number>("value") as number);

const formattedRead: FieldReadFunction<string | number> = (_, { readField }) =>
    formatted(readField<string>("name"), readField<number>("converted") as number);

const abbreviationRead: FieldReadFunction<string> = (_, { readField }) =>
    statShortNames[readField<string>("name") as string];

const typePolicies: TypePolicies = {
    Item: {
        fields: {
            color: {
                read: colorRead,
            },
        },
    },
    Stat: {
        fields: {
            adjusted: {
                read: adjustedRead,
            },
            formatted: {
                read: formattedRead,
            },
            abbreviation: {
                read: abbreviationRead,
            },
        },
    },
};

export const cache = new InMemoryCache({
    typePolicies,
});
