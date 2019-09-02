import Player from './Player';

const stats = {
    attack_power: 15,
    attack_speed: 1.2,
    magic_power: 70,
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

class Mage extends Player {
	constructor({scene, x, y}) {
        super({scene, x, y, stats});

        // console.log(this);

        scene.add.existing(this);
	}
}

export default Mage;