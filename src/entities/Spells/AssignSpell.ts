import Consecration from "./Consecration";
import EarthShield from "./EarthShield";
import Enrage from "./Enrage";
import Faith from "./Faith";
import Fireball from "./Fireball";
import Frostbolt from "./Frostbolt";
import Heal from "./Heal";
import Invocation from "./Invocation";
import ManaShield from "./ManaShield";
import Multishot from "./Multishot";
import PowerInfusion from "./PowerInfusion";
import SiphonSoul from "./SiphonSoul";
import Smite from "./Smite";
import SnareTrap from "./SnareTrap";
import Whirlwind from "./Whirlwind";
import type { SpellOptions } from "@/types/game";

const classes = {
  Consecration,
  EarthShield,
  Enrage,
  Faith,
  Fireball,
  Frostbolt,
  Heal,
  Invocation,
  ManaShield,
  Multishot,
  PowerInfusion,
  SiphonSoul,
  Smite,
  SnareTrap,
  Whirlwind
};

export type SpellType = keyof typeof classes
class AssignSpell {
  constructor(className: SpellType, opts: SpellOptions) {
    return new classes[className](opts);
  }
}

export default AssignSpell;