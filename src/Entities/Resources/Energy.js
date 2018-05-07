import Resource from './Resource';

class Energy extends Resource {

	constructor(config) {
		config.max = config.max || 100;
		config.value = config.value || 100;
		config.regen_rate = config.regen_rate || 3;
		config.regen_value = config.regen_value || 20;
		config.colour = config.colour || 0xdcd743;

		super(config);
	}
}

export default Energy;