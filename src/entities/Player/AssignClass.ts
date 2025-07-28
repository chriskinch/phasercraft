import Cleric from './Cleric';
import Mage from './Mage';
import Occultist from './Occultist';
import Ranger from './Ranger';
import Warrior from './Warrior';
import type { PlayerClassConfig } from '@/types/game';
import { ClassType } from '@config/classes';

const classes = {
	Cleric,
	Mage,
	Occultist,
	Ranger,
	Warrior
};
class AssignClass {
	constructor(className: Capitalize<ClassType>, opts: PlayerClassConfig) {
		return new classes[className](opts);
	}
}

export default AssignClass;