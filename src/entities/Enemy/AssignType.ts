import Melee from './Melee';
import Ranged from './Ranged';
import Healer from './Healer';

interface EnemyConstructorOptions {
	scene: any;
	x: number;
	y: number;
	key: string;
	target: any;
	attributes: any;
	aggro_radius?: number;
	circling_radius?: number;
	coin_multiplier: number;
	active_group: any;
	set?: number;
}

const classes = {
	Melee,
	Ranged,
	Healer
};

type EnemyTypeName = keyof typeof classes;

class AssignType {
	constructor(className: EnemyTypeName, opts: EnemyConstructorOptions) {
		return new classes[className](opts);
	}
}

export default AssignType;