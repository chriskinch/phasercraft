import Cleric from './Cleric';
import Mage from './Mage';
import Occultist from './Occultist';
import Ranger from './Ranger';
import Warrior from './Warrior';

interface ClassConstructorOptions {
	scene: any;
	x: number;
	y: number;
	abilities?: string[];
	classification?: string;
	stats?: any;
	resource_type?: string;
}

const classes = {
	Cleric,
	Mage,
	Occultist,
	Ranger,
	Warrior
};

type ClassName = keyof typeof classes;

class AssignClass {
	constructor(className: ClassName, opts: ClassConstructorOptions) {
		return new classes[className](opts);
	}
}

export default AssignClass;