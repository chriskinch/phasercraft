import Cleric from './Cleric';
import Mage from './Mage';
import Occultist from './Occultist';
import Ranger from './Ranger';
import Warrior from './Warrior';
import type { PlayerOptions } from '@/types/game';

const classes = {
	Cleric,
	Mage,
	Occultist,
	Ranger,
	Warrior
};

export type PlayerType = keyof typeof classes;
class AssignClass {
	constructor(className: PlayerType, opts: PlayerOptions) {
		if (className === null || className === undefined || !(className in classes)) {
			throw new Error(`Class "${className}" does not exist.`);
		}
		return new classes[className](opts);
	}
}

export default AssignClass;