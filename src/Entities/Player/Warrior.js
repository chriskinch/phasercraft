import Player from './Player';

class Warrior extends Player {
    constructor(config) {
        const default_stats = {
            attack_power: 70,
            attack_speed: 1,
            magic_power: 10,
            critical_chance: 10,
            speed: 150,
            range: 80,
            knockback: 100,
            defence: 60,
            health: {
                max: 1300,
                value: 1300,
                regen_value: 15,
                regen_rate: 0.75
            },
            resource: {
                type: "Rage"
            },
            abilities: ["Whirlwind", "Fireball"]
        }

        super({...default_stats, ...config});

        this.scene.add.existing(this);
	}
}

export default Warrior;