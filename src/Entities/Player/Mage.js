import Player from './Player';

class Mage extends Player {
    constructor(config) {
        const default_stats = {
            attack_power: 35,
            attack_speed: 1,
            magic_power: 80,
            critical_chance: 10,
            speed: 100,
            range: 80,
            knockback: 50,
            defence: 20,
            health: {
                max: 800,
                value: 800,
                regen_value: 10,
                regen_rate: 1
            },
            resource: {
                type: "Mana"
            },
            abilities: ["Fireball"]
        }

        super({...default_stats, ...config});

        this.scene.add.existing(this);
	}
}

export default Mage;