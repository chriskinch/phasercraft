import Bandage from './Bandage';
import Enrage from './Enrage';
import Fireball from './Fireball';
import Heal from './Heal';
import Whirlwind from './Whirlwind';

const classes = {
  Bandage,
  Enrage,
  Fireball,
  Heal,
  Whirlwind
};

class AssignSpell {
	constructor(className, opts) {
		return new classes[className](opts);
	}
}

export default AssignSpell;