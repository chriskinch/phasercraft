import Player from './Player';

const stats = {
    attack_power: 10,
    attack_speed: 1.2,
    magic_power: 40,
    speed: 150,
    range: 80,
    knockback: 80,
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

class Cleric extends Player {
	constructor({scene, x, y}) {
        super({scene, x, y, stats});

        // console.log(this);

        scene.add.existing(this);
	}
}

export default Cleric;