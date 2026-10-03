import type { PlayerName } from "@entities/Player/AssignClass";
import type { SpellType } from "@entities/Spells/AssignSpell";

// Each class's starting spells, in HUD order. Phaser-free so the store can read
// class membership and seed new characters without importing the Player
// classes. Seed source only: the Player builds its spells from the stored
// `abilityLoadout` (seeded from this kit).
export const CLASS_KITS: Record<PlayerName, readonly SpellType[]> = {
    Cleric: ["Heal", "Smite", "PowerInfusion", "Consecration", "Faith"],
    Mage: ["Fireball", "Frostbolt", "EarthShield", "ManaShield", "Invocation"],
    Occultist: ["Fireball", "SiphonSoul", "Enfeeble", "BloodFurnace"],
    Ranger: ["SnareTrap", "Multishot", "AimedShot", "Focus"],
    Warrior: ["Whirlwind", "Enrage", "BattleStomp"],
};

// Every spell id the game knows. A Record keyed by SpellType so the compiler
// flags a spell added to AssignSpell but missing here.
const KNOWN_SPELLS: Record<SpellType, true> = {
    AimedShot: true,
    BattleStomp: true,
    BloodFurnace: true,
    Consecration: true,
    EarthShield: true,
    Enrage: true,
    Enfeeble: true,
    Faith: true,
    Fireball: true,
    Focus: true,
    Frostbolt: true,
    Heal: true,
    Invocation: true,
    ManaShield: true,
    Multishot: true,
    PowerInfusion: true,
    SiphonSoul: true,
    Smite: true,
    SnareTrap: true,
    Whirlwind: true,
};

export const isKnownSpell = (id: unknown): id is SpellType =>
    typeof id === "string" && Object.prototype.hasOwnProperty.call(KNOWN_SPELLS, id);

export const isKnownClass = (id: unknown): id is PlayerName =>
    typeof id === "string" && Object.prototype.hasOwnProperty.call(CLASS_KITS, id);

// A spell is on-class when it is in the class's kit. Off-class scrolls can't be
// read (spec: Class lock).
export const isOnClass = (character: PlayerName | null, spell: SpellType): boolean =>
    isKnownClass(character) && CLASS_KITS[character].includes(spell);
