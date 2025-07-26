import Player from './Player';

interface WarriorConfig {
	scene: any;
	x: number;
	y: number;
	abilities?: string[];
	classification?: string;
	stats?: any;
	resource_type?: string;
}

class Warrior extends Player {
	constructor(config: WarriorConfig) {
		const defaults = {
			classification: "warrior",
			stats: {
				attack_power: 50,
				attack_speed: 1,
				magic_power: 10,
				critical_chance: 10,
				speed: 100,
				range: 40,
				knockback: 100,
				defence: 60,
				health_max: 1300,
				health_value: 1300,
				health_regen_value: 15,
				health_regen_rate: 0.75
			},
			resource_type: "Rage",
			abilities: ["Whirlwind", "Enrage"]
		}

		super({...defaults, ...config});
		this.scene.add.existing(this);
	}
}

export default Warrior;