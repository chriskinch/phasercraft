import Player from './Player';

class Cleric extends Player {
    constructor(config) {
        const defaults = {
            classification: "cleric",
            stats: {
                attack_power: 30,
                attack_speed: 1.1,
                magic_power: 50,
                critical_chance: 6,
                speed: 100,
                range: 40,
                knockback: 80,
                defence: 25,
                health_max: 800,
                health_value: 800,
                health_regen_value: 10,
                health_regen_rate: 1
            },
            resource_type: "Mana",
            abilities: ["Heal", "Smite", "PowerInfusion"]
        }

        super({...defaults, ...config});
        this.scene.add.existing(this);
	}
}

export default Cleric;