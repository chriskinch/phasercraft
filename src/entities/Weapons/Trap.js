import { GameObjects } from 'phaser';
import { dropIn } from '@helpers/spawnStyle';

class Trap extends GameObjects.Sprite {
	constructor(scene, x, y, lifespan) {
		super(scene, x, y - 20, 'snare-trap');
		scene.physics.world.enable(this);
		scene.add.existing(this);

        this.body.isCircle = true;

        dropIn('trap', this, y+20, { gravity: 500, bounce: 0.4 } );

        this.on('trap:spawned', this.spawnedHandler, this);

        this.scene.time.delayedCall(lifespan * 1000, () => {
            this.destroy()
        }, [], this);
    }
    
    collide(target) {
        if(target.spawned) {
            this.emit('trap:collide', target);
            this.destroy();
        }
    }

    spawnedHandler() {
        this.scene.physics.add.collider(this.scene.active_enemies, this, this.collide, null, this);
        this.scene.physics.add.collider(this.scene.player, this, this.destroy, null, this);
    }
}

export default Trap;