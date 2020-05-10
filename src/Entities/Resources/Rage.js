import Resource from './Resource';

class Rage extends Resource {
	constructor(config) {
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

	generate(player){
		super.adjustValue(5);
	}
}

export default Rage;