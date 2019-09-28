import Enrage from './Enrage';
import Fireball from './Fireball';
import Heal from './Heal';
import Smite from './Smite';
import SnareTrap from './SnareTrap';
import Whirlwind from './Whirlwind';

const classes = {
  Enrage,
  Fireball,
  Heal,
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