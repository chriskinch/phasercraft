import Health from './Health';
import Rage from './Rage';
import Mana from './Mana';
import Energy from './Energy';
import Shield from './Shield';

interface ResourceConstructorOptions {
	scene: any;
	x: number;
	y: number;
	name?: string;
	colour?: number;
	container: any;
	health_max?: number;
	health_value?: number;
	health_regen_rate?: number;
	health_regen_value?: number;
	shield_max?: number;
	shield_value?: number;
	shield_regen_rate?: number;
	shield_regen_value?: number;
	[key: string]: any;
}

const classes = {
	Health,
	Rage,
	Mana,
	Energy,
	Shield
};

type ResourceName = keyof typeof classes;

// Union type of all resource types
export type AssignResourceType = Health | Rage | Mana | Energy | Shield;

function AssignResource(className: ResourceName, opts: ResourceConstructorOptions): AssignResourceType {
	return new classes[className](opts as any);
}

export default AssignResource;