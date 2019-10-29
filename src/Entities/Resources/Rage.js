import Resource from './Resource';

class Rage extends Resource {
	constructor({
		container,
		scene,
		x,
		y,
		max = 100,
		value = 0,
		regen_rate = 0,
		regen_value = 3,
		colour = 0xb93f3c,
	}) {
		const name = "rage";
		super({name, container, scene, x, y, max, value, regen_rate, regen_value, colour});

		scene.events.on('player:attacked', this.generate, this);
		scene.events.on('player:attack', this.generate, this);
	}

	generate(player){
		super.adjustValue(5);
	}
}

export default Rage;