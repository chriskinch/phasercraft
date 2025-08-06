import Health from './Health';
import Rage from './Rage';
import Mana from './Mana';
import Energy from './Energy';
import Shield from './Shield';
import type { ResourceOptions } from './Resource';

const classes = {
	Health,
	Rage,
	Mana,
	Energy,
	Shield
};

export type AssignResourceType = Health | Rage | Mana | Energy | Shield;

// Union type of all resource types
function AssignResource(className: keyof typeof classes, opts: ResourceOptions) {
	return new classes[className](opts as any);
}

export default AssignResource;