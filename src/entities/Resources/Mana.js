import Resource from './Resource';

class Mana extends Resource {
	constructor(config) {
		const defaults = {
			name: "mana",
			resource_max: 500,
			resource_value: 500,
			resource_regen_rate: 0.2,
			resource_regen_value: 2,
			colour: 0x3a86ec
		}
		super({...defaults, ...config});
	}
}

export default Mana;