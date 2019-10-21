import Player from './Player';

class Warrior extends Player {
    constructor(config) {
        const defaults = {
            classification: "warrior",
            attack_power: 50,
            attack_speed: 1,
            magic_power: 10,
            critical_chance: 10,
            speed: 100,
            range: 40,
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
            abilities: ["Whirlwind", "Enrage"]
        }

        super({...defaults, ...config});

        this.scene.add.existing(this);
	}
}

export default Warrior;