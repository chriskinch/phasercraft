import Resource from './Resource';
import type { ResourceOptions } from './Resource';
import type Player from '@entities/Player/Player';

interface RageOptions extends ResourceOptions {
	resource_max?: number;
	resource_value?: number;
	resource_regen_rate?: number;
	resource_regen_value?: number;
}

class Rage extends Resource {
	constructor(config: RageOptions) {
		const defaults = {
			name: "rage",
			resource_max: 100,
			resource_value: 0,
			resource_regen_rate: 0,
			resource_regen_value: 3,
			colour: 0xb93f3c
		}
		super({...defaults, ...config});
		this.scene.events.on('player:attacked', this.generate, this);
		this.scene.events.on('player:attack', this.generate, this);
	}

	generate(): void {
		super.adjustValue(5);
	}
}

export default Rage;