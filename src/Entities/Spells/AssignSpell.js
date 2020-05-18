import EarthShield from "./EarthShield"
import Enrage from "./Enrage"
import Fireball from "./Fireball"
import Frostbolt from "./Frostbolt"
import Heal from "./Heal"
import Invocation from "./Invocation"
import ManaShield from "./ManaShield"
import Multishot from "./Multishot"
import PowerInfusion from "./PowerInfusion"
import SiphonSoul from "./SiphonSoul"
import Smite from "./Smite"
import SnareTrap from "./SnareTrap"
import Whirlwind from "./Whirlwind"

const classes = {
  EarthShield,
  Enrage,
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

class AssignSpell {
	constructor(className, opts) {
		return new classes[className](opts);
	}
}

export default AssignSpell;