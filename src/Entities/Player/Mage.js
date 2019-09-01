import Player from './Player';

const stats = {
    damage: 75,
    speed: 150,
    range: 160,
    swing_speed: 1.2,
    knockback: 50,
    health: {
        max: 800,
        value: 800,
        regen_value: 10,
        regen_rate: 1
    },
    resource: "Mana",
    resource_rate: 0.2
}

class Mage extends Player {
	constructor({scene, x, y}) {
        super({scene, x, y, stats});

        // console.log(this);

        scene.add.existing(this);
	}
}

export default Mage;