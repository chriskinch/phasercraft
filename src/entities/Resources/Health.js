import Resource from './Resource';
import CombatText from '../UI/CombatText';

class Health extends Resource {
	constructor(config) {
		const defaults = {
			name: "health",
			health_max: 1000,
			health_value: 1000,
			health_regen_rate: 1,
			health_regen_value: 0,
			shield_value: 0,
			colour: 0x72ce6f
		}
		super({...defaults, ...config});
	}

	adjustValue(adj, type, crit) {
		this.setValue(this.stats.value + adj);
		if(type) {
			this.container.add(new CombatText(this.scene, {
				x: 0,
				y: 0,
				value: Math.ceil(Math.abs(adj)),
				type: type,
				crit: crit
			}));
		}
	}
}

export default Health;