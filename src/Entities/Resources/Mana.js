import Resource from './Resource';

class Mana extends Resource {

	constructor(config) {
		config.max = config.max || 500;
		config.value = config.value || 500;
		config.regen_rate = config.regen_rate || 0.2;
		config.regen_value = config.regen_value || 2;
		config.colour = config.colour || 0x3a86ec;

		super(config);
	}
}

export default Mana;