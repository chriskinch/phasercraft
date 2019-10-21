import Resource from './Resource';

class Mana extends Resource {
	constructor({
		container,
		scene,
		x,
		y,
		max = 500,
		value = 500,
		regen_rate = 0.2,
		regen_value = 2,
		colour = 0x3a86ec,
	}) {
		const name = "mana";
		super({name, container, scene, x, y, max, value, regen_rate, regen_value, colour});
	}
}

export default Mana;