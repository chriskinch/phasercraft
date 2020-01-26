import EarthShield from "./EarthShield"
import Enrage from "./Enrage"
import Fireball from "./Fireball"
import Heal from "./Heal"
import ManaShield from "./ManaShield"
import Multishot from "./Multishot"
import SiphonSoul from "./SiphonSoul"
import Smite from "./Smite"
import SnareTrap from "./SnareTrap"
import Whirlwind from "./Whirlwind"

const classes = {
  EarthShield,
  Enrage,
  Fireball,
  Heal,
  ManaShield,
  Multishot,
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