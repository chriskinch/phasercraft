import type { Scene, GameObjects, Math as PhaserMath, Types, Physics, Tilemaps } from "phaser";
import type Player from "@entities/Player/Player";
import type Enemy from "@entities/Enemy/Enemy";
import type { SpellType } from "@entities/Spells/AssignSpell";

// The object Arcade physics passes to collide/overlap callbacks. Mirrors the
// union in `Phaser.Types.Physics.Arcade.ArcadePhysicsCallback`; callbacks accept
// this (so they satisfy the callback signature) then narrow to the real entity.
export type ArcadeCollisionObject =
    | Types.Physics.Arcade.GameObjectWithBody
    | Physics.Arcade.Body
    | Physics.Arcade.StaticBody
    | Tilemaps.Tile;

export const EQUIPMENT_SLOTS = {
    AMULET: "amulet",
    BODY: "body",
    HELM: "helm",
    WEAPON: "weapon",
} as const;

export const ITEM_CATEGORIES = {
    AMULET: "amulet",
    ARMOR: "armor",
    AXE: "axe",
    BOW: "bow",
    GEM: "gem",
    HELMET: "helmet",
    MISC: "misc",
    STAFF: "staff",
    SWORD: "sword",
} as const;

export const STAT_NAMES = {
    ATTACK_POWER: "attack_power",
    ATTACK_SPEED: "attack_speed",
    MAGIC_POWER: "magic_power",
    CRITICAL_CHANCE: "critical_chance",
    SPEED: "speed",
    DEFENCE: "defence",
    HEALTH_MAX: "health_max",
    HEALTH_REGEN_RATE: "health_regen_rate",
    HEALTH_REGEN_VALUE: "health_regen_value",
} as const;

export const UI_MENUS = {
    ARCANUM: "arcanum",
    ARMORY: "armory",
    CHARACTER: "character",
    EQUIPMENT: "equipment",
    LOAD: "load",
    SAVE: "save",
    SELECT: "select",
    SYSTEM: "system",
} as const;

export const COMBAT_TYPES = {
    MELEE: "melee",
    RANGED: "ranged",
    HEALER: "healer",
} as const;

export const PLAYER_CLASSES = {
    CLERIC: "cleric",
    MAGE: "mage",
    OCCULTIST: "occultist",
    RANGER: "ranger",
    WARRIOR: "warrior",
} as const;

export const SAVE_SLOTS = {
    SLOT_A: "slot_a",
    SLOT_B: "slot_b",
    SLOT_C: "slot_c",
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
        MANA_SHIELD: 130,
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
        FROSTBOLT_SLOW: -0.5,
    },
} as const;

// Stackable crafting components (the non-currency loot routed through `Crafting`).
// Single source of truth for each type's stack ceiling, sell value, icon frame,
// display name and shop-tooltip flavour text. `stackMax`/`sellValue` are
// placeholder balance values — tune in review.
export const COMPONENT_DEFS: Record<ComponentType, ComponentDef> = {
    scrap: {
        stackMax: 99,
        sellValue: 2,
        icon: "scrap",
        name: "Scrap",
        description: "Bent nails and busted buckles. One smith's junk is another's jackpot.",
    },
    cloth: {
        stackMax: 99,
        sellValue: 3,
        icon: "cloth",
        name: "Cloth",
        description: "Softer than it looks, tougher than it smells. Great for patching heroes.",
    },
    ichor: {
        stackMax: 20,
        sellValue: 8,
        icon: "ichor",
        name: "Ichor",
        description: "Still faintly glowing. Try not to think about where it came from.",
    },
    bone: {
        stackMax: 99,
        sellValue: 2,
        icon: "bone",
        name: "Bone",
        description: "Ethically sourced from things that were already trying to eat you.",
    },
};

// Every component type, as a runtime array (the union `ComponentType` is
// compile-time only) — e.g. for the merchant's buy buttons.
export const COMPONENT_TYPES = Object.keys(COMPONENT_DEFS) as ComponentType[];

// Buying a part at the merchant costs a multiple of its sell value: a standard
// shop margin so buying back is dearer than selling, and so hunting for parts
// stays worthwhile. Placeholder balance value — tune in review.
export const COMPONENT_BUY_MULTIPLIER = 3;
export const componentBuyPrice = (type: ComponentType): number =>
    COMPONENT_DEFS[type].sellValue * COMPONENT_BUY_MULTIPLIER;

// --- Merchant stock rotation --------------------------------------------------
// The Merchant's Parts stock re-rolls on a fixed real-time cycle, aligned to the
// wall clock so the same window shows the same stock across a reload ("time of
// day") and every client agrees without persisting anything. Gear stock is
// session-lived and does NOT use any of this — it only tracks what the player
// sold. All placeholder balance values — tune in review.
export const MERCHANT_RESTOCK_MS = 10 * 60 * 1000; // 10 minutes
export const MERCHANT_MAX_STOCK = 10; // ceiling for a random restock roll

// Which restock window `now` falls in. Rolls over every MERCHANT_RESTOCK_MS,
// which is the signal the shop uses to forget the run's sold/bought part counts.
export const merchantWindow = (now: number): number => Math.floor(now / MERCHANT_RESTOCK_MS);

// Milliseconds left in the current window, for the "refreshes in" countdown.
export const merchantRestockRemaining = (now: number): number =>
    MERCHANT_RESTOCK_MS - (now % MERCHANT_RESTOCK_MS);

// Deterministic base stock (0..MERCHANT_MAX_STOCK inclusive) for a part type in a
// given window. A tiny FNV-1a hash of `window:type` gives a stable spread with
// nothing stored — not security-sensitive, just needs to look random per window.
export const merchantPartsBase = (window: number, type: ComponentType): number => {
    const key = `${window}:${type}`;
    let h = 2166136261;
    for (let i = 0; i < key.length; i++) {
        h = Math.imul(h ^ key.charCodeAt(i), 16777619);
    }
    return (h >>> 0) % (MERCHANT_MAX_STOCK + 1);
};

export const ITEM_QUALITY_WEIGHTS = {
    AMULET: 3,
    ARMOR: 30,
    AXE: 40,
    BOW: 6,
    GEM: 10,
    HELMET: 50,
    MISC: 12,
    STAFF: 3,
    SWORD: 24,
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
        [STAT_NAMES.HEALTH_REGEN_RATE]: 1,
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
        [STAT_NAMES.HEALTH_REGEN_RATE]: 1,
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
        [STAT_NAMES.HEALTH_REGEN_RATE]: 0.9,
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
        [STAT_NAMES.HEALTH_REGEN_RATE]: 1,
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
        [STAT_NAMES.HEALTH_REGEN_RATE]: 0.75,
    },
} as const;

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

type LootType = "coin" | "gem" | "scrap" | "cloth" | "ichor" | "bone";

// The stackable subset of loot (currency — coin, gem — is excluded; it credits coins
// directly rather than entering the inventory).
export type ComponentType = "scrap" | "cloth" | "ichor" | "bone";

// One stack of a component in the inventory. `quantity` is kept ≤ the type's
// `COMPONENT_DEFS[type].stackMax`; overflow beyond that opens a new stack.
export interface ComponentStack {
    id: string;
    type: ComponentType;
    quantity: number;
}

export interface ComponentDef {
    stackMax: number;
    sellValue: number;
    icon: string;
    name: string;
    // Short flavour blurb shown in the Merchant's buy tooltip.
    description: string;
}
export interface LootDropRate {
    name: LootType;
    rate: number;
    bonus: number;
}

export interface LootTable extends Array<LootDropRate> {}
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
    health?: number;
    mana?: number;
    energy?: number;
    rage?: number;
    shield?: number;
    range?: number;
    knockback?: number;
    resource_type?: string;
    resource_max?: number;
    resource_regen_value?: number;
    resource_regen_rate?: number;
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
    immovable?: boolean;
    // Ranged classes fire their basic attack as a homing projectile.
    attack_projectile?: SpellProjectileConfig;
}

export interface ResourceStats {
    max: number;
    value: number;
    regen_rate: number;
    regen_value: number;
    missing?: number;
}

export type EnemyType = "baby-ghoul" | "egbert" | "ghoul" | "imp" | "satyr" | "skeleton" | "slime";
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
    type: Capitalize<CombatType>;
    coin_multiplier: number;
    loot_table: LootTable;
    aggro_radius?: number;
}

export interface EnemyOptions {
    scene: Scene;
    type: Capitalize<CombatType>;
    x: number;
    y: number;
    key: EnemyType;
    target: Player | Enemy | null;
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

// How a spell acquires its target when cast:
// - "self":   always the casting player, no target tap needed
// - "enemy":  the selected enemy, else the closest live enemy within
//             castRange (auto-selected), else the next tapped enemy while primed
// - "ground": a world point chosen by the next tap while primed
// - "none":   no target at all (PBAoE / auras) — cast fires immediately
export type TargetKind = "self" | "enemy" | "ground" | "none";

export interface SpellProjectileConfig {
    key: string;
    // Frame within the key's spritesheet to use as the projectile visual.
    frame?: string | number;
    speed: number;
}

// Declarative casting metadata for a spell. The CastingController reads this
// to drive target acquisition, range checks and cast bars centrally, so
// spells never wire their own input events.
export interface SpellDefinition {
    name: string;
    icon_name: string;
    cost: { [key: string]: number };
    cooldown: number;
    targetKind: TargetKind;
    // Max cast/placement distance in px; undefined = unlimited. Named
    // castRange because several spells already use `range` for their AoE
    // scan radius (Whirlwind, Multishot).
    castRange?: number;
    // Wind-up seconds before the effect lands; 0/undefined = instant.
    castTime?: number;
    // Channel seconds; the effect runs for the duration and can be broken.
    channelDuration?: number;
    // Radius of a ground/PBAoE effect, also drawn by the target reticle.
    aoeRadius?: number;
    // When set, the cast launches a homing projectile that applies the
    // effect on impact instead of instantly.
    projectile?: SpellProjectileConfig;
}

export interface SpellOptions {
    scene: Scene;
    x: number;
    y: number;
    key: string;
    // Every spell is created by the Player (see Player's ability map). The spell
    // reads Player-only members, so the owner is modelled as a Player.
    player: Player;
    cost?: { [key: string]: number };
    cooldown?: number;
    name?: string;
    icon_name?: string;
    hotkey: string;
    slot: number;
    loop?: boolean;
    cooldownDelay?: boolean;
    cooldownDelayAll?: boolean;
    // Declarative casting metadata (see SpellDefinition); every spell's
    // defaults declare a targetKind and the CastingController drives the
    // cast flow from it.
    targetKind?: TargetKind;
    castRange?: number;
    castTime?: number;
    channelDuration?: number;
    aoeRadius?: number;
    projectile?: SpellProjectileConfig;
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
    components: ComponentStack[];
}

// Unused, and deliberately NOT kept in sync with the live game state.
//
// This models a speculative multi-character save (keyed `characters`,
// `selected_character`, `loot` as a record) that nothing references — neither this
// interface nor `CharacterData` above has a single consumer in `src/`. The real
// state shape is `GameState` in `src/store/gameReducer.ts`, which is what
// `store/index.ts`, `saveStorage` and every component import.
//
// So new persisted fields (the Blacksmith's `recipes`, and `components` before it)
// are added there, not here. Retiring this pair is a separate cleanup.
export interface GameState {
    characters: Record<string, CharacterData>;
    selected_character: string | null;
    loot: Record<string, LootItem>;
    coins: number;
    base_stats: PlayerStats;
    stats: PlayerStats;
    equipment: Equipment;
    inventory: LootItem[];
    components: ComponentStack[];
}

// --- Blacksmith crafting ------------------------------------------------------
// A recipe turns a fixed bundle of components plus coins into one specific piece
// of gear. Unlike the Armory — which sells randomly generated items — the
// Blacksmith's output is known in advance: that is the whole point of the shop,
// so `result` carries a hand-authored statline rather than rolling one.
//
// `result.stats` values sit at the TOP of the quality band's pool the armory
// rolls within (fine 25–50, rare 40–80, epic 65–130 — see `getQualityMap` in
// `api/armory/_lib/generateItem.ts`), so a crafted item is the best roll of its
// tier. That premium is what the material cost buys.
//
// All material/coin numbers are placeholder balance values — tune in review.
export interface RecipeResult {
    name: string;
    category: string;
    set: string;
    icon: string;
    quality: string;
    // Coin value of the finished item, used for the sell refund like any gear.
    cost: number;
    stats: Array<{ name: string; value: number }>;
}

export interface Recipe {
    id: string;
    materials: Partial<Record<ComponentType, number>>;
    coins: number;
    result: RecipeResult;
}

export const RECIPES: Recipe[] = [
    {
        id: "scrappers-blade",
        materials: { scrap: 15, bone: 5 },
        coins: 10,
        result: {
            name: "Scrapper's Blade",
            category: ITEM_CATEGORIES.SWORD,
            set: EQUIPMENT_SLOTS.WEAPON,
            icon: "sword_7",
            quality: "fine",
            cost: 15,
            stats: [
                { name: STAT_NAMES.ATTACK_POWER, value: 35 },
                { name: STAT_NAMES.CRITICAL_CHANCE, value: 15 },
            ],
        },
    },
    {
        id: "padded-jerkin",
        materials: { cloth: 12, scrap: 8 },
        coins: 10,
        result: {
            name: "Padded Jerkin",
            category: ITEM_CATEGORIES.ARMOR,
            set: EQUIPMENT_SLOTS.BODY,
            icon: "armor_12",
            quality: "fine",
            cost: 15,
            stats: [
                { name: STAT_NAMES.DEFENCE, value: 30 },
                { name: STAT_NAMES.HEALTH_MAX, value: 20 },
            ],
        },
    },
    {
        id: "bonecap-helm",
        materials: { bone: 18, cloth: 6 },
        coins: 10,
        result: {
            name: "Bonecap Helm",
            category: ITEM_CATEGORIES.HELMET,
            set: EQUIPMENT_SLOTS.HELM,
            icon: "helmet_9",
            quality: "fine",
            cost: 15,
            stats: [
                { name: STAT_NAMES.DEFENCE, value: 25 },
                { name: STAT_NAMES.HEALTH_REGEN_VALUE, value: 25 },
            ],
        },
    },
    {
        id: "ichorbound-amulet",
        materials: { ichor: 10, cloth: 15 },
        coins: 30,
        result: {
            name: "Ichorbound Amulet",
            category: ITEM_CATEGORIES.AMULET,
            set: EQUIPMENT_SLOTS.AMULET,
            icon: "amulet_2",
            quality: "rare",
            cost: 40,
            stats: [
                { name: STAT_NAMES.MAGIC_POWER, value: 45 },
                { name: STAT_NAMES.HEALTH_REGEN_RATE, value: 20 },
                { name: STAT_NAMES.SPEED, value: 15 },
            ],
        },
    },
    {
        id: "marrow-greatsword",
        materials: { bone: 30, scrap: 20 },
        coins: 30,
        result: {
            name: "Marrow Greatsword",
            category: ITEM_CATEGORIES.SWORD,
            set: EQUIPMENT_SLOTS.WEAPON,
            icon: "sword_18",
            quality: "rare",
            cost: 40,
            stats: [
                { name: STAT_NAMES.ATTACK_POWER, value: 50 },
                { name: STAT_NAMES.ATTACK_SPEED, value: 30 },
            ],
        },
    },
    {
        id: "ichor-forged-plate",
        materials: { ichor: 25, cloth: 30, scrap: 20 },
        coins: 80,
        result: {
            name: "Ichor-Forged Plate",
            category: ITEM_CATEGORIES.ARMOR,
            set: EQUIPMENT_SLOTS.BODY,
            icon: "armor_23",
            quality: "epic",
            cost: 90,
            stats: [
                { name: STAT_NAMES.DEFENCE, value: 60 },
                { name: STAT_NAMES.HEALTH_MAX, value: 50 },
                { name: STAT_NAMES.HEALTH_REGEN_VALUE, value: 20 },
            ],
        },
    },
];

// Recipes a new character already knows, so the Blacksmith teaches the shop's
// purpose on the first visit rather than opening as an empty room. Everything
// else is learnt from schematics (drops and the Blacksmith's rotating stock).
export const INITIAL_RECIPES = ["scrappers-blade", "padded-jerkin", "bonecap-helm"];

export const recipeById = (id: string): Recipe | undefined => RECIPES.find((r) => r.id === id);
