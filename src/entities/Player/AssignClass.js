import Cleric from './Cleric';
import Mage from './Mage';
import Occultist from './Occultist';
import Ranger from './Ranger';
import Warrior from './Warrior';

const classes = {
    Cleric,
    Mage,
    Occultist,
    Ranger,
    Warrior
};

class AssignSpell {
	constructor(className, opts) {
		return new classes[className](opts);
	}
}

export default AssignSpell;