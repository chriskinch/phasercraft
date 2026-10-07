import AimedShot from "./AimedShot";
import BattleStomp from "./BattleStomp";
import BloodFurnace from "./BloodFurnace";
import Consecration from "./Consecration";
import EarthShield from "./EarthShield";
import Enrage from "./Enrage";
import Enfeeble from "./Enfeeble";
import Faith from "./Faith";
import Fireball from "./Fireball";
import Focus from "./Focus";
import Frostbolt from "./Frostbolt";
import Heal from "./Heal";
import Invocation from "./Invocation";
import ManaShield from "./ManaShield";
import Multishot from "./Multishot";
import PowerInfusion from "./PowerInfusion";
import SiphonSoul from "./SiphonSoul";
import Smite from "./Smite";
import SnareTrap from "./SnareTrap";
import Retaliation from "./Retaliation";
import Whirlwind from "./Whirlwind";
import type Spell from "./Spell";
import type { SpellOptions, SpellType } from "@/types/game";

// `SpellType` lives in the Phaser-free `@/types/game` (alongside SPELL_DEFS);
// `satisfies` keeps this class map and that union exactly in step.
export type { SpellType };

const classes = {
    AimedShot,
    BattleStomp,
    BloodFurnace,
    Consecration,
    EarthShield,
    Enrage,
    Enfeeble,
    Faith,
    Fireball,
    Focus,
    Frostbolt,
    Heal,
    Invocation,
    ManaShield,
    Multishot,
    PowerInfusion,
    SiphonSoul,
    Smite,
    SnareTrap,
    Retaliation,
    Whirlwind,
} satisfies Record<SpellType, new (opts: SpellOptions) => Spell>;

// Build the concrete Spell for a spell id, typed as the Spell it returns.
export const createSpell = (className: SpellType, opts: SpellOptions): Spell =>
    new classes[className](opts);

class AssignSpell {
    constructor(className: SpellType, opts: SpellOptions) {
        return new classes[className](opts);
    }
}

export default AssignSpell;
