import Health from './Health';
import Rage from './Rage';
import Mana from './Mana';
import Energy from './Energy';
import Shield from './Shield';

const classes = {
  Health,
  Rage,
  Mana,
  Energy,
  Shield
};

class AssignResource {
	constructor(className, opts) {
		return new classes[className](opts);
	}
}

export default AssignResource;