import Player from './Player';

interface RangerConfig {
	scene: any;
	x: number;
	y: number;
	abilities?: string[];
	classification?: string;
	stats?: any;
	resource_type?: string;
}

class Ranger extends Player {
	constructor(config: RangerConfig) {
		const defaults = {
			classification: "ranger",
			stats: {
				attack_power: 40,
				attack_speed: 0.9,
				magic_power: 30,
				critical_chance: 13,
				speed: 100,
				range: 120,
				knockback: 20,
				defence: 15,
				health_max: 1000,
				health_value: 1000,
				health_regen_value: 10,
				health_regen_rate: 1
			},
			resource_type: "Energy",
			abilities: ["SnareTrap", "Multishot"]
		}

		super({...defaults, ...config});
		this.scene.add.existing(this);
	}
}

export default Ranger;