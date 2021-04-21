import Player from './Player';

class Warrior extends Player {
    constructor(config) {
        const defaults = {
            classification: "warrior",
            stats: {
                attack_power: 100,
                attack_speed: 60,
                magic_power: 20,
                critical_chance: 120,
                speed: 100,
                range: 40,
                knockback: 100,
                defence: 120,
                health_max: 130,
                health_value: 130,
                health_regen_value: 150,
                health_regen_rate: 130
            },
            resource_type: "Rage",
            abilities: ["Whirlwind", "Enrage"]
        }

        super({...defaults, ...config});
        this.scene.add.existing(this);
	}
}

export default Warrior;