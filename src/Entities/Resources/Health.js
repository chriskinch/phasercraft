import Resource from './Resource';

class Health extends Resource {

	constructor(config) {
		config.max = config.max || 1000;
		config.value = config.value || 1000;
		config.regen_rate = config.regen_rate || 1;
		config.regen_value = config.regen_value || 0;
		config.colour = config.colour || 0x72ce6f;

		super(config);
	}
}

export default Health;