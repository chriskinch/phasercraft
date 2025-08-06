import Melee from './Melee';
import Ranged from './Ranged';
import Healer from './Healer';
import type { EnemyOptions } from '@/types/game';

const classes = {
	Melee,
	Ranged,
	Healer
};
class AssignType {
	constructor(className: keyof typeof classes, opts: EnemyOptions) {
		return new classes[className](opts);
	}
}

export default AssignType;