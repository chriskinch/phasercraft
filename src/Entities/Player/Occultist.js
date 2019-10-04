import Player from './Player';

class Occultist extends Player {
	constructor(config) {
        const default_stats = {
            attack_power: 30,
            attack_speed: 1.2,
            magic_power: 60,
            critical_chance: 8,
            speed: 150,
            range: 160,
            knockback: 50,
            defence: 30,
            health: {
                max: 1000,
                value: 1000,
                regen_value: 12,
                regen_rate: 0.9
            },
            resource: {
                type: "Mana"
            },
            abilities: ["Fireball", "SiphonSoul", "Smite"]
        }

        super({...default_stats, ...config});

        this.scene.add.existing(this);
	}
}

export default Occultist;