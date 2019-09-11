import Player from './Player';

class Ranger extends Player {
    constructor(config) {
        const default_stats = {
            attack_power: 50,
            attack_speed: 0.85,
            magic_power: 30,
            critical_chance: 15,
            speed: 150,
            range: 240,
            knockback: 20,
            health: {
                max: 1000,
                value: 1000,
                regen_value: 10,
                regen_rate: 1
            },
            resource: {
                type: "Energy"
            }
        }

        super({...default_stats, ...config});

        this.scene.add.existing(this);
	}
}

export default Ranger;