import Health from './Health';
import Rage from './Rage';
import Mana from './Mana';
import Energy from './Energy';

const classes = {
  Health,
  Rage,
  Mana,
  Energy
};

class AssignResource {
	constructor(className, opts) {
		return new classes[className](opts);
	}
}

export default AssignResource;