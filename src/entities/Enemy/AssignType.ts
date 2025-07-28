import Melee from './Melee';
import Ranged from './Ranged';
import Healer from './Healer';
import type { EnemyClassConfig } from '@/types/game';
import type { CombatType } from '@/config/classes';

const classes = {
	Melee,
	Ranged,
	Healer
};
class AssignType {
	constructor(className: Capitalize<CombatType>, opts: EnemyClassConfig) {
		return new classes[className](opts);
	}
}

export default AssignType;