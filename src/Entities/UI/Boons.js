class Boons extends Phaser.GameObjects.Group {
	constructor(scene, player) {
		super(scene);
		// const { centerX, centerY } = this.scene.physics.world.bounds;
        this.player = player;
        console.log(this);
    }
    
    addBoon(boon) {
        this.add(boon);

        this.calculate();
    }

    calculate() {
        this.children.entries.map(boon => {
            console.log(this.player.stats);
		    console.log(boon.value);
        });
    }
}

export default Boons;
