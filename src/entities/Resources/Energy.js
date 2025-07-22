import Resource from './Resource';

class Energy extends Resource {
	constructor(config) {
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