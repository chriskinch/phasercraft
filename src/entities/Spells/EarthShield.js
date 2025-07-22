import Spell from './Spell';

class EarthShield extends Spell {
	constructor(config) {
		const defaults = {
            name: "earthshield",
			icon_name: 'icon_0008_ki',
			cooldown: 10,
			cost: {
				rage: 75,
				mana: 120,
				energy: 70
			},
            type: 'magic',
            lifespan: 20,
            rate: 250,
            capacity: 8,
            charges: 8,
            ready: true,
            cooldownDelay: true
        }
		super({ ...defaults, ...config });   
        this.radius = 40;
    }

	setCastEvents(state){
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:player', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
	}

    effect(target){
        this.setVisible(true);
        this.scene.physics.world.enable(this);
        // this.body.syncBounds = true;
        this.body.isCircle = true;
        this.body.setCircle(30); //TODO: Must be a better way!?
        this.body.setOffset(40, 20); //TODO: Must be a better way!?
        this.body.immovable = true;
        this.scene.physics.add.collider(this.scene.active_enemies, this, this.touch, null, this);
        this.lifespanTimer = this.scene.time.addEvent({
            delay: this.lifespan * 1000,
            callback: () => {
                this.end();
            },
            callbackScope: this
        });
        if(this.motion) this.motion.restart();
    }

    throttle() {
        return this.scene.time.addEvent({
            delay: this.rate,
            callback: () => {
                this.ready = true;
                this.throttleDelay.remove(false);
            },
            callbackScope: this
        });
    }

    end() {
        this.cooldownTimer = this.setCooldown();
        this.monitorSpell();
        this.motion.remove();
        delete this.motion;
        this.anims.currentAnim.resume();
        this.lifespanTimer.remove();
        delete this.lifespanTimer;
        this.charges = this.capacity;
        this.body.setEnable(false);
        this.setVisible(false);
        this.setScale(1);
    }

    touch(enemy) {
        if(this.ready) {
            // The actual hit.
            const value = this.setValue({ base: 10, key: "magic_power" });
            enemy.health.adjustValue(-value.amount, this.type, value.crit);
            // Reduce charges and scale.
            this.charges--;
            this.setScale(this.charges/this.capacity);
            // Not ready until delay timer completes.
            this.ready = false;
            this.throttleDelay = this.throttle();
        }
        // Kill this spell when we are out of charges.
        if(this.charges <= 0) this.end();
    }

    animationStart() {
        this.x = this.target.x + this.radius;
		this.y = this.target.y;
    }

	animationUpdate(){
        const frames = this.anims.currentAnim.frames.length - 1;
        const end = this.anims.currentAnim.frames[frames];
        if(this.anims.currentFrame === end) {
            this.anims.currentAnim.pause(end);
            this.motion = this.startMotion();
        }
    }
    
    startMotion() {
        return this.scene.tweens.addCounter({
			from: 0,
            to: 360,
            repeat: -1,
            duration: 3000,
            delay: 250,
			onUpdate: () => {
                const time = Math.floor(this.motion.getValue());
                const angle = Math.PI/180 * time;
                this.x = Math.cos(angle) * this.radius + this.target.x;
                this.y = -Math.sin(angle) * (this.radius * 0.75) + this.target.y; // 0.75 to squash the radius for perspective.
                // Crazy depth sorting. If spell is south of target it must go over all entities.
                // If it's north of target it need to go between the target and all entities hence 
                // the sub pixel numbers.
                const sub_depth = (this.y - this.target.y) / this.radius;
                (this.y > this.target.y) ? this.setDepth(10000) : this.setDepth(this.target.y + sub_depth)
            }
        });
    }
}

export default EarthShield;