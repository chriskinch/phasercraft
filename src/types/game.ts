import type { Scene, GameObjects, Math as PhaserMath} from "phaser";
import type Player from "@entities/Player/Player";
import type Enemy from "@entities/Enemy/Enemy";
import type { SpellType } from "@entities/Spells/AssignSpell";

// Constants
export const EQUIPMENT_SLOTS = {
    AMULET: 'amulet',
    BODY: 'body', 
    HELM: 'helm',
    WEAPON: 'weapon'
} as const;

export const ITEM_CATEGORIES = {
    AMULET: 'amulet',
    ARMOR: 'armor',
    AXE: 'axe',
    BOW: 'bow',
    GEM: 'gem',
    HELMET: 'helmet',
    MISC: 'misc',
    STAFF: 'staff',
    SWORD: 'sword'
} as const;

export const STAT_NAMES = {
    ATTACK_POWER: 'attack_power',
    ATTACK_SPEED: 'attack_speed', 
    MAGIC_POWER: 'magic_power',
    CRITICAL_CHANCE: 'critical_chance',
    SPEED: 'speed',
    DEFENCE: 'defence',
    HEALTH_MAX: 'health_max',
    HEALTH_REGEN_RATE: 'health_regen_rate',
    HEALTH_REGEN_VALUE: 'health_regen_value'
} as const;

export const UI_MENUS = {
    ARCANUM: 'arcanum',
    ARMORY: 'armory',
    CHARACTER: 'character',
    EQUIPMENT: 'equipment',
    LOAD: 'load',
    SAVE: 'save',
    SELECT: 'select',
    SYSTEM: 'system'
} as const;

export const COMBAT_TYPES = {
    MELEE: 'melee',
    RANGED: 'ranged', 
    HEALER: 'healer',
} as const;

export const PLAYER_CLASSES = {
    CLERIC: 'cleric',
    MAGE: 'mage',
    OCCULTIST: 'occultist',
    RANGER: 'ranger',
    WARRIOR: 'warrior'
} as const;

export const SAVE_SLOTS = {
    SLOT_A: 'slot_a',
    SLOT_B: 'slot_b', 
    SLOT_C: 'slot_c'
} as const;

export const GAME_BALANCE = {
    RESTOCK_AMOUNT: 45,
    DEFAULT_PLAYER_SPEED: 100,
    CRITICAL_MULTIPLIER: 1.5,
    BASE_KNOCKBACK_MULTIPLIER: 200,
    DEFAULT_LOOT_GRID_COLS: 4,
    ARMORY_LOOT_GRID_COLS: 6,
    MAX_VELOCITY: 10000,
    COIN_VELOCITY_RANGE: { MIN: 25, MAX: 50 },
    COIN_DRAG: 100,
    SPELL_BASE_DAMAGE: {
        FIREBALL: 45,
        FROSTBOLT: 35,
        HEAL: 150,
        SMITE: 30,
        CONSECRATION: 5,
        CONSECRATION_TICK: 3,
        WHIRLWIND: 30,
        MULTISHOT: 30,
        EARTH_SHIELD: 10,
        SIPHON_SOUL: 10,
        FAITH: 20,
        MANA_SHIELD: 130
    },
    SPELL_BUFFS: {
        ENRAGE_CRIT_BONUS: 10,
        ENRAGE_ATTACK_BONUS: 0.2,
        ENRAGE_REGEN_BONUS: 1.0,
        ENRAGE_REGEN_RATE_BONUS: -0.25,
        POWER_INFUSION_CRIT_BONUS: 10,
        POWER_INFUSION_ATTACK_BONUS: 0.2,
        POWER_INFUSION_MAGIC_BONUS: 0.2,
        POWER_INFUSION_SPEED_BONUS: 0.1,
        FROSTBOLT_SLOW: -0.5
    }
} as const;

export const ITEM_QUALITY_WEIGHTS = {
    AMULET: 3,
    ARMOR: 30,
    AXE: 40,
    BOW: 6,
    GEM: 10,
    HELMET: 50,
    MISC: 12,
    STAFF: 3,
    SWORD: 24
} as const;

export const CHARACTER_BASE_STATS = {
    [PLAYER_CLASSES.CLERIC]: {
        [STAT_NAMES.ATTACK_POWER]: 30,
        [STAT_NAMES.ATTACK_SPEED]: 1.1,
        [STAT_NAMES.MAGIC_POWER]: 50,
        [STAT_NAMES.CRITICAL_CHANCE]: 6,
        [STAT_NAMES.SPEED]: 100,
        [STAT_NAMES.DEFENCE]: 25,
        [STAT_NAMES.HEALTH_MAX]: 800,
        [STAT_NAMES.HEALTH_REGEN_VALUE]: 10,
        [STAT_NAMES.HEALTH_REGEN_RATE]: 1
    },
    [PLAYER_CLASSES.MAGE]: {
        [STAT_NAMES.ATTACK_POWER]: 35,
        [STAT_NAMES.ATTACK_SPEED]: 1,
        [STAT_NAMES.MAGIC_POWER]: 80,
        [STAT_NAMES.CRITICAL_CHANCE]: 10,
        [STAT_NAMES.SPEED]: 100,
        [STAT_NAMES.DEFENCE]: 20,
        [STAT_NAMES.HEALTH_MAX]: 800,
        [STAT_NAMES.HEALTH_REGEN_VALUE]: 10,
        [STAT_NAMES.HEALTH_REGEN_RATE]: 1
    },
    [PLAYER_CLASSES.OCCULTIST]: {
        [STAT_NAMES.ATTACK_POWER]: 30,
        [STAT_NAMES.ATTACK_SPEED]: 1.2,
        [STAT_NAMES.MAGIC_POWER]: 60,
        [STAT_NAMES.CRITICAL_CHANCE]: 8,
        [STAT_NAMES.SPEED]: 100,
        [STAT_NAMES.DEFENCE]: 30,
        [STAT_NAMES.HEALTH_MAX]: 1000,
        [STAT_NAMES.HEALTH_REGEN_VALUE]: 12,
        [STAT_NAMES.HEALTH_REGEN_RATE]: 0.9
    },
    [PLAYER_CLASSES.RANGER]: {
        [STAT_NAMES.ATTACK_POWER]: 40,
        [STAT_NAMES.ATTACK_SPEED]: 0.9,
        [STAT_NAMES.MAGIC_POWER]: 30,
        [STAT_NAMES.CRITICAL_CHANCE]: 13,
        [STAT_NAMES.SPEED]: 100,
        [STAT_NAMES.DEFENCE]: 15,
        [STAT_NAMES.HEALTH_MAX]: 1000,
        [STAT_NAMES.HEALTH_REGEN_VALUE]: 10,
        [STAT_NAMES.HEALTH_REGEN_RATE]: 1
    },
    [PLAYER_CLASSES.WARRIOR]: {
        [STAT_NAMES.ATTACK_POWER]: 50,
        [STAT_NAMES.ATTACK_SPEED]: 1,
        [STAT_NAMES.MAGIC_POWER]: 10,
        [STAT_NAMES.CRITICAL_CHANCE]: 10,
        [STAT_NAMES.SPEED]: 100,
        [STAT_NAMES.DEFENCE]: 60,
        [STAT_NAMES.HEALTH_MAX]: 1300,
        [STAT_NAMES.HEALTH_REGEN_VALUE]: 15,
        [STAT_NAMES.HEALTH_REGEN_RATE]: 0.75
    }
} as const;

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

type LootType = "coin" | "gem" | "scrap" | "cloth" | "ichor";
export interface LootDropRate {
    name: LootType;
    rate: number;
    bonus: number;
}

export interface LootTable extends Array<LootDropRate>{}
export interface PlayerStats {
    [STAT_NAMES.ATTACK_POWER]?: number;
    [STAT_NAMES.ATTACK_SPEED]?: number;
    [STAT_NAMES.MAGIC_POWER]?: number;
    [STAT_NAMES.CRITICAL_CHANCE]?: number;
    [STAT_NAMES.SPEED]?: number;
    [STAT_NAMES.DEFENCE]?: number;
    [STAT_NAMES.HEALTH_MAX]?: number;
    [STAT_NAMES.HEALTH_REGEN_VALUE]?: number;
    [STAT_NAMES.HEALTH_REGEN_RATE]?: number;
    // Additional properties that may exist in local player stats
    health?: number;
    mana?: number;
    energy?: number;
    rage?: number;
    shield?: number;
    range?: number;
    knockback?: number;
    resource_type?: string;
    resource_max?: number;
    // Allow index signature for flexibility
    [key: string]: number | string | undefined;
}

export interface PlayerOptions {
	scene: Scene;
	x: number;
	y: number;
	abilities: SpellType[];
	classification: string;
	stats?: PlayerStats;
	resource_type?: string;
}

export type EnemyType = "baby-ghoul" | "egbert" | "ghoul" | "imp" | "satyr" | "slime";
export type CombatType = "melee" | "ranged" | "healer";
export type TargetType = Enemy | Player | GameObjects.GameObject | { x: number; y: number } | null;
export interface EnemyAttributes {
    damage: number;
    speed: number;
    range: number;
    attack_speed: number;
    health_max: number;
    health_regen_rate: number;
}
export interface EnemyConfig extends EnemyAttributes {
    type: Capitalize<CombatType>,
    coin_multiplier: 10,
    loot_table: LootTable
    aggro_radius?: number;
}

export interface EnemyOptions {
	scene: Scene;
    type: Capitalize<CombatType>;
	x: number;
	y: number;
	key: EnemyType;
	target: Player | Enemy| null;
    types?: Record<string, EnemyAttributes>;
	attributes: EnemyAttributes;
    loot_table: LootTable;
	aggro_radius?: number;
	circling_radius?: number;
	coin_multiplier: number;
	active_group: Phaser.GameObjects.Group;
	wave_multiplier?: number;
    vector?: EntityWithVector;
}

export interface SpellOptions {
    scene: Scene;
	x: number;
	y: number;
	key: string;
	player: Player | Enemy;
	cost?: { [key: string]: number };
	cooldown?: number;
	name?: string;
	icon_name?: string;
	hotkey: string;
	slot: number;
	loop?: boolean;
	cooldownDelay?: boolean;
	cooldownDelayAll?: boolean;
}

interface AdjustValue {
    adjustValue: (amount: number, type?: string, crit?: boolean) => void;
}

export interface EntityWithVector {
    x?: number;
    y?: number;
    range?: number | undefined;
    angle?: number | undefined;
}

export interface Equipment {
    amulet?: LootItem | null;
    body?: LootItem | null;
    helm?: LootItem | null;
    weapon?: LootItem | null;
    [key: string]: LootItem | null | undefined;
}

export interface CharacterData {
    id: string;
    name: string;
    class: keyof typeof PLAYER_CLASSES;
    level: number;
    experience: number;
    base_stats: PlayerStats;
    stats: PlayerStats;
    equipment: Equipment;
    coins: number;
    inventory: LootItem[];
    crafting: LootItem[];
}

export interface GameState {
    characters: Record<string, CharacterData>;
    selected_character: string | null;
    loot: Record<string, LootItem>;
    coins: number;
    base_stats: PlayerStats;
    stats: PlayerStats;
    equipment: Equipment;
    inventory: LootItem[];
    crafting: LootItem[];
}