export const statNames = Object.freeze({
    ATTACK_POWER: "attack_power",
    ATTACK_SPEED: 'attack_speed',
    MAGIC_POWER: 'magic_power',
    CRITICAL_CHANCE: 'critical_chance',
    SPEED: 'speed',
    DEFENCE: 'defence',
    HEALTH_MAX: 'health_max',
    HEALTH_MAX_RATE: 'health_max_rate',
    HEALTH_REGEN_RATE: 'health_regen_rate',
    HEALTH_REGEN_VALUE: 'health_regen_value',
});

export const itemCategories = Object.freeze({
    AMULET: 'amulet',
    ARMOR: 'armor',
    AXE: 'axe',
    BOW: 'bow',
    GEM: 'gem',
    HELMET: 'helmet',
    MISC: 'misc',
    STAFF: 'staff',
    SWORD: 'sword',
});

export enum Stats {
    attack_power = "attack_power",
    attack_speed = "attack_speed",
    magic_power = "magic_power",
    critical_chance = "critical_chance",
    speed = "speed",
    defence = "defence",
    health_max = "health_max",
    health_max_rate = "health_max_rate",
    health_regen_rate = "health_regen_rate",
    health_regen_value = "health_regen_value",
};

export enum Categories {
    Amulet = "amulet",
    Armor = "armor",
    Axe = "axe",
    Bow = "bow",
    Gem = "gem",
    Helmet = "helmet",
    Misc = "misc",
    Staff = "staff",
    Sword = "sword",
};

export enum Qualities {
    "common",
    "fine",
    "rare",
    "epic",
    "legendary"
};