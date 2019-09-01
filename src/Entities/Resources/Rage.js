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
		super({container, scene, x, y, max, value, regen_rate, regen_value, colour});

		scene.events.on('player:attacked', this.generate, this);
		scene.events.on('player:attack', this.generate, this);
	}

	generate(player, damage){
		let amount = Math.ceil(damage/10);
		super.adjustValue(amount);
	}
}

export default Rage;