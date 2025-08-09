import Resource from './Resource';
import type { ResourceOptions } from './Resource';

interface ManaOptions extends ResourceOptions {
	resource_max?: number;
	resource_value?: number;
	resource_regen_rate?: number;
	resource_regen_value?: number;
}

class Mana extends Resource {
	constructor(config: ManaOptions) {
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