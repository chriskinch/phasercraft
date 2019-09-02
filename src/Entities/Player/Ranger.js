import Player from './Player';

const stats = {
    attack_power: 50,
    attack_speed: 0.8,
    magic_power: 20,
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

class Ranger extends Player {
	constructor({scene, x, y}) {
        super({scene, x, y, stats});

        // console.log(this);

        scene.add.existing(this);
	}
}

export default Ranger;