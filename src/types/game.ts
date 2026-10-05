import type { Scene, GameObjects, Math as PhaserMath, Types, Physics, Tilemaps } from "phaser";
import type Player from "@entities/Player/Player";
import type Enemy from "@entities/Enemy/Enemy";
import type { PlayerName } from "@entities/Player/AssignClass";

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
        lore: "Bent iron from a broken fence. Nobody misses it.",
        description: "Bent nails and busted buckles. One smith's junk is another's jackpot.",
    },
    cloth: {
        stackMax: 99,
        sellValue: 3,
        icon: "cloth",
        name: "Cloth",
        lore: "A scrap of old tunic. It has seen better days.",
        description: "Softer than it looks, tougher than it smells. Great for patching heroes.",
    },
    ichor: {
        stackMax: 20,
        sellValue: 8,
        icon: "ichor",
        name: "Ichor",
        lore: "Sticky, dark and faintly warm. Best not to ask where it came from.",
        description: "Still faintly glowing. Try not to think about where it came from.",
    },
    bone: {
        stackMax: 99,
        sellValue: 2,
        icon: "bone",
        name: "Bone",
        lore: "Picked clean by crows. Still sturdy enough to be useful.",
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

type LootType = "coin" | "gem" | "scrap" | "cloth" | "ichor" | "bone" | "special" | "scroll";

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
    // Story text shown in the inventory Parts tooltip.
    lore: string;
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
    // Fixed spell list (slot order = HUD order) overriding the stored ability
    // loadout; the town passes `[]`. Omitted: the player builds its spells from
    // the store's `abilityLoadout` + `learnedSpells` and follows live changes.
    abilities?: (SpellType | null)[];
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
    // Learned level (from `learnedSpells`); defaults to 1.
    level?: SpellLevel;
    // Registry key (from spellDefDefaults); looks up the level curves.
    spellType?: SpellType;
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

// --- Special items (Blacksmith Step 4d) ---------------------------------------
// A rare drop the player can slot into one craft to add a bonus stat to the
// finished item. Owned specials persist in the save as `specials` (id → count).
// Consumed only by a successful craft; the bonus is appended to the crafted
// item's stats, or added to an existing stat of the same name, and `cost` is
// added to the crafted item's coin value (so it sells for more). One bonus stat
// per special; a special never changes the crafted item's rarity.
//
// Content is placeholder, not agreed: the names, bonuses and costs are tuning
// values. `bonus.value` is in pool units like a recipe statline (so
// critical_chance 50 reads +5%). Sprites come from the loot/misc pack.
export interface SpecialItem {
    id: string;
    name: string;
    // Sprite under graphics/images/loot/misc/, and the Phaser texture key
    // `special-<id>` the world drop uses.
    icon: string;
    quality: string;
    description: string;
    bonus: { name: string; value: number };
    cost: number;
}

export const SPECIAL_ITEMS: SpecialItem[] = [
    {
        id: "void-pearl",
        name: "Void Pearl",
        icon: "misc_2",
        quality: "epic",
        description: "A pearl that swallows the light around it.",
        bonus: { name: STAT_NAMES.CRITICAL_CHANCE, value: 50 },
        cost: 20,
    },
    {
        id: "ember-core",
        name: "Ember Core",
        icon: "misc_9",
        quality: "rare",
        description: "Still warm from the heart of a fire elemental.",
        bonus: { name: STAT_NAMES.ATTACK_POWER, value: 20 },
        cost: 12,
    },
    {
        id: "frost-shard",
        name: "Frost Shard",
        icon: "misc_5",
        quality: "rare",
        description: "A splinter of ice that never melts.",
        bonus: { name: STAT_NAMES.DEFENCE, value: 20 },
        cost: 12,
    },
    {
        id: "troll-heart",
        name: "Troll Heart",
        icon: "misc_7",
        quality: "epic",
        description: "It keeps beating long after the troll stopped.",
        bonus: { name: STAT_NAMES.HEALTH_MAX, value: 25 },
        cost: 20,
    },
];

export const specialById = (id: string): SpecialItem | undefined =>
    SPECIAL_ITEMS.find((s) => s.id === id);

// Drop rates for the `special` loot-table entry, in `Enemy.dropLoot`'s "drops
// per kill x 100" units: the same odds as schematic drops (docs/ROADMAP.md,
// Step 4b) — 1% from a regular mob, one guaranteed from a boss.
export const SPECIAL_DROP_RATE = { mob: 1, boss: 100 } as const;

// --- Spell metadata (Abilities, Stage 1) --------------------------------------
// Every spell the game can build. Defined here as a plain string-literal union
// (not derived from AssignSpell's class map) so this module stays Phaser-free at
// runtime; AssignSpell type-checks its class map against it.
export type SpellType =
    | "AimedShot"
    | "BattleStomp"
    | "BloodFurnace"
    | "Consecration"
    | "EarthShield"
    | "Enrage"
    | "Enfeeble"
    | "Faith"
    | "Fireball"
    | "Focus"
    | "Frostbolt"
    | "Heal"
    | "Invocation"
    | "ManaShield"
    | "Multishot"
    | "PowerInfusion"
    | "SiphonSoul"
    | "Smite"
    | "SnareTrap"
    | "Whirlwind";

// Resource cost per resource type; the casting player pays the entry matching
// its own resource. A type alias (not an interface) so it stays assignable to
// SpellOptions' `{ [key: string]: number }` cost.
export type SpellCost = {
    rage: number;
    mana: number;
    energy: number;
};

// Static, Phaser-free spell metadata: the single source of truth for the values
// a spell instance reads at construction, readable by the React UI without
// instantiating a Phaser object.
// A spell's level, raised by reading higher-level scrolls. Max 3.
export type SpellLevel = 1 | 2 | 3;
export const SPELL_LEVELS: readonly SpellLevel[] = [1, 2, 3];

// Spell power multiplier by level: #387's proposed curve (L1 ×1.0, L2 ×1.35,
// L3 ×1.8), balance TBD. The `power` curve of every setValue() spell.
export const SPELL_LEVEL_POWER: Record<SpellLevel, number> = { 1: 1, 2: 1.35, 3: 1.8 };

// Level scaling (#387): a multiplier per level for one aspect of a spell.
export type LevelCurve = Record<SpellLevel, number>;
// Aspect → curve. An aspect without a curve stays at its L1 value; the aspects
// each spell can scale are listed in SPELL_ASPECTS.
export type SpellScaling = Partial<Record<string, LevelCurve>>;

export interface SpellDef {
    // Display name. (The spell instance's own lowercase `name` is its animation /
    // texture key and stays in the spell class.)
    name: string;
    description: string;
    effect: string;
    // Classes whose ability list includes the spell.
    classes: PlayerName[];
    icon_name: string;
    cooldown: number;
    cost: SpellCost;
    // Max cast/placement distance in px; undefined = unlimited / not targeted.
    castRange?: number;
    targetKind: TargetKind;
    // Per-aspect level curves (#387). Required: every ability defines how it
    // scales with level (pick from its SPELL_ASPECTS); a test fails if it is empty.
    scaling: SpellScaling;
}

// Description/effect copy is PLACEHOLDER — to be replaced with final copy.
export const SPELL_DEFS: Record<SpellType, SpellDef> = {
    AimedShot: {
        name: "Aimed Shot",
        description: "A steadied shot that hits hard.",
        effect: "Wind-up, then fires a homing arrow at an enemy.",
        classes: ["Ranger"],
        icon_name: "icon_0029_aimed-shot",
        cooldown: 6,
        cost: { rage: 40, mana: 60, energy: 50 },
        castRange: 300,
        targetKind: "enemy",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    BattleStomp: {
        name: "Battle Stomp",
        description: "Shake the ground underfoot.",
        effect: "Stuns nearby enemies.",
        classes: ["Warrior"],
        icon_name: "icon_0027_battle-stomp",
        cooldown: 6,
        cost: { rage: 30, mana: 60, energy: 40 },
        targetKind: "self",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    BloodFurnace: {
        name: "Blood Furnace",
        description: "Burn your own blood for power.",
        effect: "Trades health for mana over time.",
        classes: ["Occultist"],
        icon_name: "icon_0036_blood-furnace",
        cooldown: 15,
        cost: { rage: 0, mana: 0, energy: 0 },
        targetKind: "self",
        scaling: { manaPerTick: SPELL_LEVEL_POWER },
    },
    Consecration: {
        name: "Consecration",
        description: "Hallow the ground around you.",
        effect: "Damages enemies standing in the area over time.",
        classes: ["Cleric"],
        icon_name: "icon_0003_decay",
        cooldown: 30,
        cost: { rage: 60, mana: 100, energy: 70 },
        targetKind: "none",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    EarthShield: {
        name: "Earth Shield",
        description: "Stone armour that soaks blows.",
        effect: "Grants a recharging damage shield.",
        classes: ["Mage"],
        icon_name: "icon_0008_ki",
        cooldown: 10,
        cost: { rage: 75, mana: 120, energy: 70 },
        targetKind: "self",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    Enrage: {
        name: "Enrage",
        description: "Let the fury take over.",
        effect: "Boosts crit, attack power and health regen for a short time.",
        classes: ["Warrior"],
        icon_name: "icon_0019_fire-wall",
        cooldown: 10,
        cost: { rage: 10, mana: 80, energy: 30 },
        targetKind: "self",
        scaling: {
            critical_chance: SPELL_LEVEL_POWER,
            attack_power: SPELL_LEVEL_POWER,
            health_regen_value: SPELL_LEVEL_POWER,
        },
    },
    Enfeeble: {
        name: "Enfeeble",
        description: "Sap an enemy's strength.",
        effect: "Greatly reduces an enemy's damage for a time.",
        classes: ["Occultist"],
        icon_name: "icon_0028_enfeeble",
        cooldown: 5,
        cost: { rage: 10, mana: 15, energy: 10 },
        castRange: 250,
        targetKind: "enemy",
        scaling: { duration: SPELL_LEVEL_POWER },
    },
    Faith: {
        name: "Faith",
        description: "Trust in the light.",
        effect: "Heals you periodically for a time.",
        classes: ["Cleric"],
        icon_name: "icon_0026_regen",
        cooldown: 20,
        cost: { rage: 15, mana: 30, energy: 20 },
        targetKind: "self",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    Fireball: {
        name: "Fireball",
        description: "A ball of roaring flame.",
        effect: "Launches a homing fireball at an enemy.",
        classes: ["Mage", "Occultist"],
        icon_name: "icon_0017_fire-ball",
        cooldown: 1,
        cost: { rage: 30, mana: 50, energy: 40 },
        castRange: 250,
        targetKind: "enemy",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    Focus: {
        name: "Focus",
        description: "Steady your breathing.",
        effect: "Boosts your combat stats for a short time.",
        classes: ["Ranger"],
        icon_name: "icon_0030_focus",
        cooldown: 20,
        cost: { rage: 15, mana: 80, energy: 25 },
        targetKind: "self",
        scaling: { duration: SPELL_LEVEL_POWER, critical_chance: SPELL_LEVEL_POWER },
    },
    Frostbolt: {
        name: "Frostbolt",
        description: "A shard of biting ice.",
        effect: "Damages and slows an enemy.",
        classes: ["Mage"],
        icon_name: "icon_0012_beam",
        cooldown: 1,
        cost: { rage: 20, mana: 35, energy: 25 },
        castRange: 250,
        targetKind: "enemy",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    Heal: {
        name: "Heal",
        description: "Mend your wounds.",
        effect: "Wind-up, then restores health.",
        classes: ["Cleric"],
        icon_name: "icon_0015_heal",
        cooldown: 5,
        cost: { rage: 25, mana: 40, energy: 30 },
        targetKind: "self",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    Invocation: {
        name: "Invocation",
        description: "Call on deep reserves.",
        effect: "Greatly boosts resource regen for a short time.",
        classes: ["Mage"],
        icon_name: "icon_0014_haste",
        cooldown: 60,
        cost: { rage: 0, mana: 0, energy: 0 },
        targetKind: "self",
        scaling: { resource_regen_value: SPELL_LEVEL_POWER },
    },
    ManaShield: {
        name: "Mana Shield",
        description: "A barrier woven from mana.",
        effect: "Absorbs incoming damage.",
        classes: ["Mage"],
        icon_name: "icon_0011_freeze",
        cooldown: 10,
        cost: { rage: 75, mana: 120, energy: 70 },
        targetKind: "self",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    Multishot: {
        name: "Multishot",
        description: "Loose a volley of arrows.",
        effect: "Fires at several nearby enemies at once.",
        classes: ["Ranger"],
        icon_name: "icon_0004_corpse-explode",
        cooldown: 0,
        cost: { rage: 50, mana: 100, energy: 60 },
        targetKind: "none",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    PowerInfusion: {
        name: "Power Infusion",
        description: "Radiant power floods your body.",
        effect: "Boosts many of your stats for a time.",
        classes: ["Cleric"],
        icon_name: "icon_0009_blind",
        cooldown: 30,
        cost: { rage: 20, mana: 100, energy: 40 },
        targetKind: "self",
        scaling: {
            critical_chance: SPELL_LEVEL_POWER,
            attack_power: SPELL_LEVEL_POWER,
            magic_power: SPELL_LEVEL_POWER,
            speed: SPELL_LEVEL_POWER,
            resource_regen_value: SPELL_LEVEL_POWER,
        },
    },
    SiphonSoul: {
        name: "Siphon Soul",
        description: "Drain the life from a foe.",
        effect: "Channels damage into an enemy, healing you.",
        classes: ["Occultist"],
        icon_name: "icon_0000_death",
        cooldown: 5,
        cost: { rage: 60, mana: 100, energy: 60 },
        castRange: 200,
        targetKind: "enemy",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    Smite: {
        name: "Smite",
        description: "Holy wrath strikes a foe.",
        effect: "Damages an enemy.",
        classes: ["Cleric"],
        icon_name: "icon_0007_bolt",
        cooldown: 3,
        cost: { rage: 30, mana: 50, energy: 40 },
        castRange: 300,
        targetKind: "enemy",
        scaling: { power: SPELL_LEVEL_POWER },
    },
    SnareTrap: {
        name: "Snare Trap",
        description: "A hidden jaw of iron.",
        effect: "Places a trap that roots and bleeds an enemy.",
        classes: ["Ranger"],
        icon_name: "icon_0020_shackle",
        cooldown: 0,
        cost: { rage: 20, mana: 30, energy: 20 },
        castRange: 300,
        targetKind: "ground",
        scaling: { duration: SPELL_LEVEL_POWER, damage: SPELL_LEVEL_POWER },
    },
    Whirlwind: {
        name: "Whirlwind",
        description: "Spin into the fray.",
        effect: "Strikes several nearby enemies.",
        classes: ["Warrior"],
        icon_name: "icon_0005_coil",
        cooldown: 2,
        cost: { rage: 50, mana: 80, energy: 60 },
        targetKind: "none",
        scaling: { power: SPELL_LEVEL_POWER },
    },
};

// Every spell type, as a runtime array (the union is compile-time only).
export const SPELL_TYPES = Object.keys(SPELL_DEFS) as SpellType[];

// The aspects each spell can level-scale (#387) — the keys its `scaling` may
// use. `power` = setValue() output; `duration` = effect length in seconds; other
// keys are the spell's own numbers (buff/bane stat modifiers by stat name, per-
// tick amounts, trap damage…). Wiring a new aspect = read it via the spell's
// level factor and list it here.
export const SPELL_ASPECTS: Record<SpellType, readonly string[]> = {
    AimedShot: ["power"],
    BattleStomp: ["power"],
    BloodFurnace: ["duration", "hpPerTick", "manaPerTick"],
    Consecration: ["power"],
    EarthShield: ["power"],
    Enrage: [
        "duration",
        "critical_chance",
        "attack_power",
        "health_regen_value",
        "health_regen_rate",
    ],
    Enfeeble: ["duration", "damage"],
    Faith: ["power"],
    Fireball: ["power"],
    Focus: ["duration", "critical_chance", "attack_speed"],
    Frostbolt: ["power"],
    Heal: ["power"],
    Invocation: ["duration", "resource_regen_value", "resource_regen_rate"],
    ManaShield: ["power"],
    Multishot: ["power"],
    PowerInfusion: [
        "duration",
        "critical_chance",
        "attack_power",
        "magic_power",
        "speed",
        "resource_regen_value",
        "resource_regen_rate",
    ],
    SiphonSoul: ["power"],
    Smite: ["power"],
    SnareTrap: ["duration", "damage", "lifespan"],
    Whirlwind: ["power"],
};

// The construction defaults a spell takes from its def. `cost` is copied so no
// instance shares (or can mutate) the registry's object; `castRange` is only
// set when the def has one, matching the old per-spell defaults exactly.
export const spellDefDefaults = (
    type: SpellType
): Pick<SpellDef, "icon_name" | "cooldown" | "cost" | "targetKind"> & {
    castRange?: number;
    spellType: SpellType;
} => {
    const { icon_name, cooldown, cost, targetKind, castRange } = SPELL_DEFS[type];
    return {
        spellType: type,
        icon_name,
        cooldown,
        cost: { ...cost },
        targetKind,
        ...(castRange === undefined ? {} : { castRange }),
    };
};

// --- Abilities (docs/specs/abilities-ui.md → Data model) ---

// Active and passive loadouts each have this many slots (slot 1–5 = HUD order).
export const ABILITY_SLOTS = 5;

// Scrolls of one spell + level merged at the Arcanum into 1 of the next level (#386).
export const SCROLL_MERGE_COUNT = 3;

// Coins per scroll sold, by scroll level. Placeholder, balance TBD (#544 open
// question 1).
export const SCROLL_SELL_VALUE: Record<SpellLevel, number> = { 1: 10, 2: 30, 3: 90 };

// --- Spell recipes (Arcanum crafting, #580) -----------------------------------
// Trading one found scroll of a spell at the Arcanum learns its recipe; a learnt
// recipe crafts an L1 scroll from components + coins + its one special item
// (mandatory). Deconstructing a scroll of a learnt spell returns the recipe's
// components and special, ×3 per level above L1 (the inverse of Merge), for a
// flat coin fee; the recipe's coins are not refunded.
//
// Required: every ability has a recipe (a test fails otherwise). All numbers and
// special picks are placeholder balance values — tune in review.
export interface SpellRecipe {
    materials: Partial<Record<ComponentType, number>>;
    coins: number;
    // SPECIAL_ITEMS id; exactly one is consumed per craft.
    special: string;
}

export const SPELL_RECIPES: Record<SpellType, SpellRecipe> = {
    AimedShot: { materials: { cloth: 8, bone: 6 }, coins: 25, special: "void-pearl" },
    BattleStomp: { materials: { scrap: 10, bone: 5 }, coins: 25, special: "troll-heart" },
    BloodFurnace: { materials: { bone: 8, ichor: 3 }, coins: 30, special: "ember-core" },
    Consecration: { materials: { cloth: 8, scrap: 4 }, coins: 30, special: "ember-core" },
    EarthShield: { materials: { cloth: 6, ichor: 3 }, coins: 30, special: "troll-heart" },
    Enrage: { materials: { scrap: 10, bone: 5 }, coins: 25, special: "ember-core" },
    Enfeeble: { materials: { bone: 8, ichor: 3 }, coins: 25, special: "frost-shard" },
    Faith: { materials: { cloth: 8, scrap: 4 }, coins: 25, special: "troll-heart" },
    Fireball: { materials: { cloth: 6, ichor: 3 }, coins: 25, special: "ember-core" },
    Focus: { materials: { cloth: 8, bone: 6 }, coins: 25, special: "void-pearl" },
    Frostbolt: { materials: { cloth: 6, ichor: 3 }, coins: 25, special: "frost-shard" },
    Heal: { materials: { cloth: 8, scrap: 4 }, coins: 25, special: "troll-heart" },
    Invocation: { materials: { cloth: 6, ichor: 4 }, coins: 30, special: "void-pearl" },
    ManaShield: { materials: { cloth: 6, ichor: 3 }, coins: 30, special: "frost-shard" },
    Multishot: { materials: { cloth: 8, bone: 6 }, coins: 30, special: "ember-core" },
    PowerInfusion: { materials: { cloth: 8, scrap: 4 }, coins: 30, special: "void-pearl" },
    SiphonSoul: { materials: { bone: 8, ichor: 4 }, coins: 30, special: "void-pearl" },
    Smite: { materials: { cloth: 8, scrap: 4 }, coins: 25, special: "ember-core" },
    SnareTrap: { materials: { cloth: 8, bone: 6 }, coins: 25, special: "frost-shard" },
    Whirlwind: { materials: { scrap: 10, bone: 5 }, coins: 30, special: "frost-shard" },
};

// Flat coin fee to deconstruct one scroll, any level. Placeholder.
export const SCROLL_DECONSTRUCT_COST = 15;

// Passive abilities. Plumbing only: the registry is empty and passives have no
// effects yet, so the union is empty (`never`). Add string literals here and
// matching entries in PASSIVE_DEFS when the first passive lands.
export type PassiveType = never;

export interface PassiveDef {
    name: string;
    description: string;
}

export const PASSIVE_DEFS: Record<PassiveType, PassiveDef> = {};
