import Resource from './Resource';

class Energy extends Resource {
	constructor({
		container,
		scene,
		x,
		y,
		max = 100,
		value = 100,
		regen_rate = 2,
		regen_value = 20,
		colour = 0xdcd743,
	}) {
		const name = "energy";
		super({name, container, scene, x, y, max, value, regen_rate, regen_value, colour});
	}
}

export default Energy;