import Resource from './Resource';
import CombatText from '../UI/CombatText';

class Health extends Resource {
	constructor({
		container,
		scene,
		x,
		y,
		max = 1000,
		value = 1000,
		regen_rate = 1,
		regen_value = 0,
		colour = 0x72ce6f,
	}) {
		super({container, scene, x, y, max, value, regen_rate, regen_value, colour});
	}

	adjustValue(adj, type, crit) {
		this.setValue(this.stats.value + adj);
		if(type) {
			this.container.add(new CombatText(this.scene, {
				x: 0,
				y: 0,
				value: Math.abs(adj),
				type: type,
				crit: crit
			}));
		}
	}
}

export default Health;