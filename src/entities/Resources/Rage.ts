import Resource from './Resource';

interface RageConfig {
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

class Rage extends Resource {
	constructor(config: RageConfig) {
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

	generate(player: any): void {
		super.adjustValue(5);
	}
}

export default Rage;