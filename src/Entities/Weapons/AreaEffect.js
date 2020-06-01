import { GameObjects, Geom } from "phaser"

class AreaEffect extends GameObjects.Sprite {
	constructor(scene, x, y, lifespan) {
		super(scene, x, y - 7, 'snare-trap');
		scene.physics.world.enable(this);
		scene.add.existing(this);
        
        var shape = new Geom.Circle(46, 45, 45);

        this.scene.physics.add.overlap(this.scene.active_enemies, this, this.overlap, this.throttle, this);
        
        this.setScale(5, 4);
        this.setInteractive(shape, Geom.Circle.Contains)
        this.timestamps = {};

        this.scene.time.delayedCall(lifespan * 1000, () => {
            delete(this.timestamps);
            this.destroy()
        }, [], this);
    }
    
    overlap(target) {
        this.timestamps[target.uuid] = this.scene.game.getTime();
        this.emit('area:overlap', target);
    }

    throttle(target) {
        console.log(!this.timestamps[target.uuid])
        return this.timestamps[target.uuid] ? this.scene.game.getTime() - this.timestamps[target.uuid] > 1000 : !this.timestamps[target.uuid];
    }
}

export default AreaEffect;