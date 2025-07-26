import Player from './Player';

interface OccultistConfig {
	scene: any;
	x: number;
	y: number;
	abilities?: string[];
	classification?: string;
	stats?: any;
	resource_type?: string;
}

class Occultist extends Player {
	constructor(config: OccultistConfig) {
		const defaults = {
			classification: "occultist",
			stats: {
				attack_power: 30,
				attack_speed: 1.2,
				magic_power: 60,
				critical_chance: 8,
				speed: 100,
				range: 80,
				knockback: 50,
				defence: 30,
				health_max: 1000,
				health_value: 1000,
				health_regen_value: 12,
				health_regen_rate: 0.9
			},
			resource_type: "Mana",
			abilities: ["Fireball", "SiphonSoul"]
		}

		super({...defaults, ...config});
		this.scene.add.existing(this);
	}
}

export default Occultist;