import Player from './Player';

class Mage extends Player {
    constructor(config) {
        const default_stats = {
            attack_power: 15,
            attack_speed: 1.2,
            magic_power: 80,
            speed: 150,
            range: 160,
            knockback: 50,
            health: {
                max: 800,
                value: 800,
                regen_value: 10,
                regen_rate: 1
            },
            resource: {
                type: "Mana"
            }
        }

        super({...default_stats, ...config});

        this.scene.add.existing(this);
	}
}

export default Mage;