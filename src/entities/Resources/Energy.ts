import Resource from './Resource';
import type { ResourceOptions } from './Resource';
export interface EnergyOptions extends ResourceOptions {
	resource_max?: number;
	resource_value?: number;
	resource_regen_rate?: number;
	resource_regen_value?: number;
}

class Energy extends Resource {
	constructor(config: EnergyOptions) {
		const defaults = {
			name: "energy",
			resource_max: 100,
			resource_value: 100,
			resource_regen_rate: 2,
			resource_regen_value: 20,
			colour: 0xdcd743
		}
		super({...defaults, ...config});
	}
}

export default Energy;