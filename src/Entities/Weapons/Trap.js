class Trap extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'snare-trap');
		scene.physics.world.enable(this);
		scene.add.existing(this);
        
        scene.physics.add.collider(scene.enemies, this, this.collide, null, this);
        scene.physics.add.collider(scene.player, this, this.destroy, null, this);

        this.body.immovable = true;
        this.body.isCircle = true;
    }
    
    collide(target) {
        this.emit('trap:collide', target);
        this.destroy();
    }
}

export default Trap;