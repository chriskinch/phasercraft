import Resource from './Resource';
import CombatText from '../UI/CombatText';
import type { ResourceOptions } from './Resource';

interface HealthOptions extends ResourceOptions {
	health_max?: number;
	health_value?: number;
	health_regen_rate?: number;
	health_regen_value?: number;
	shield_value?: number;
}

class Health extends Resource {
	constructor(config: HealthOptions) {
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

	adjustValue(adj: number, type?: string, crit?: boolean): void {
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