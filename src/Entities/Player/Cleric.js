import Player from './Player';

class Cleric extends Player {
    constructor(config) {
        const defaults = {
            classification: "cleric",
            attack_power: 30,
            attack_speed: 1.1,
            magic_power: 50,
            critical_chance: 6,
            speed: 100,
            range: 40,
            knockback: 80,
            defence: 25,
            health: {
                max: 800,
                value: 800,
                regen_value: 10,
                regen_rate: 1
            },
            resource: {
                type: "Mana"
            },
            abilities: ["Heal", "Smite"]
        }

        super({...defaults, ...config});

        this.scene.add.existing(this);
	}
}

export default Cleric;