import Melee from './Melee';
import Ranged from './Ranged';
import Healer from './Healer';

const classes = {
    Melee,
    Ranged,
    Healer
};

class AssignType {
	constructor(className, opts) {
		return new classes[className](opts);
	}
}

export default AssignType;