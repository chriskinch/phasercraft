import Heal from './Heal';
import Fireball from './Fireball';
import Whirlwind from './Whirlwind';

const classes = {
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