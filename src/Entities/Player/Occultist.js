import Player from './Player';

const stats = {
    damage: 50,
    speed: 150,
    range: 160,
    swing_speed: 1.2,
    knockback: 50,
    health: {
        max: 1000,
        value: 1000,
        regen_value: 12,
        regen_rate: 0.9
    },
    resource: {
        type: "Mana"
    }
}

class Occultist extends Player {
	constructor({scene, x, y}) {
        super({scene, x, y, stats});

        // console.log(this);

        scene.add.existing(this);
	}
}

export default Occultist;