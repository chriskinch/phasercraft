import { GameObjects } from "phaser"

class AreaEffect extends GameObjects.Sprite {
	constructor(scene, x, y, lifespan, range) {
		super(scene, x, y - 7, 'consecration');
		scene.physics.world.enable(this);
		scene.add.existing(this);
        
        this.scene.physics.add.overlap(this.scene.active_enemies, this, this.overlap, this.throttle, this);
        this.scene.physics.add.overlap(this.scene.player, this, this.overlap, this.throttle, this);

        this.body.isCircle = true;

        const offset = (this.width/2) - range
        this.body.setCircle(range, offset, offset);

        this.setScale(1, 0.8);
        
        this.timestamps = {};

        this.scene.time.delayedCall(lifespan * 1000, () => {
            delete(this.timestamps);
            this.destroy()
        }, [], this);
    }
    
    overlap(target) {
        const type = target.name === 'player' ? 'player' : 'enemy';
        this.timestamps[target.uuid] = this.scene.game.getTime();
        this.emit(`${type}:area:overlap`, target);
    }

    throttle(target) {
        return this.timestamps[target.uuid] ? this.scene.game.getTime() - this.timestamps[target.uuid] > 1000 : !this.timestamps[target.uuid];
    }
}

export default AreaEffect;