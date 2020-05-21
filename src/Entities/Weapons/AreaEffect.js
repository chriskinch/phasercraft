import { GameObjects } from 'phaser';

class AreaEffect extends GameObjects.Sprite {
	constructor(scene, x, y, lifespan) {
		super(scene, x, y - 20, 'snare-trap');
		scene.physics.world.enable(this);
		scene.add.existing(this);

        this.body.isCircle = true;

        this.scene.time.delayedCall(lifespan * 1000, () => {
            this.destroy()
        }, [], this);

        this.scene.physics.add.collider(this.scene.active_enemies, this, this.collide, null, this, true);
        this.body.immovable = true;

        this.setScale(5);
    }
    
    collide(target) {
        console.log(target)
        if(target.spawned) {
            this.emit('trap:collide', target);
        }
    }
}

export default AreaEffect;