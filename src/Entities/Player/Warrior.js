import Player from './Player';

const stats = {
    attack_power: 70,
    attack_speed: 1,
    magic_power: 10,
    speed: 150,
    range: 80,
    knockback: 100,
    health: {
        max: 1300,
        value: 1300,
        regen_value: 15,
        regen_rate: 0.75
    },
    resource: {
        type: "Rage"
    }
}

class Warrior extends Player {
	constructor({scene, x, y}) {
        super({scene, x, y, stats});

        // console.log(this);

        scene.add.existing(this);
	}
}

export default Warrior;