import Heal from './Heal';
import Fireball from './Fireball';

const classes = {
  Fireball,
  Heal
};

class AssignSpell {
	constructor(className, opts) {
		return new classes[className](opts);
	}
}

export default AssignSpell;