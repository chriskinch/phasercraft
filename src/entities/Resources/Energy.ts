import Resource from './Resource';

interface EnergyConfig {
	scene: any;
	x: number;
	y: number;
	name?: string;
	colour?: number;
	container: any;
	resource_max?: number;
	resource_value?: number;
	resource_regen_rate?: number;
	resource_regen_value?: number;
	[key: string]: any;
}

class Energy extends Resource {
	constructor(config: EnergyConfig) {
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