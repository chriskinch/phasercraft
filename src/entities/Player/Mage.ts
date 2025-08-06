import Player from './Player';
import { PlayerOptions } from '@/types/game';

class Mage extends Player {
	constructor(config: PlayerOptions) {
		const defaults = {
			classification: "mage",
			stats: {
				attack_power: 35,
				attack_speed: 1,
				magic_power: 80,
				critical_chance: 10,
				speed: 100,
				range: 80,
				knockback: 50,
				defence: 20,
				health_max: 800,
				health_value: 800,
				health_regen_value: 10,
				health_regen_rate: 1
			},
			resource_type: "Mana",
			abilities: ["Fireball", "Frostbolt", "EarthShield", "ManaShield", "Invocation"]
		}

		super({...defaults, ...config});
		this.scene.add.existing(this);
	}
}

export default Mage;