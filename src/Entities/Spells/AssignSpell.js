import Heal from './Heal';	

const classes = {
    Heal
};

class AssignSpell {
	constructor(className, opts) {
		return new classes[className](opts);
	}
}

export default AssignSpell;