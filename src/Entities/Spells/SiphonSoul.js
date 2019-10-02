import Spell from './Spell';

class SiphonSoul extends Spell {
	constructor(config) {
		const defaults = {
			icon_name: 'icon_0000_death',
			cooldown: 5,
			cost: {
				rage: 60,
				mana: 100,
				energy: 60
			},
            type: 'magic',
            duration: 5,
            cooldownDelay: true
		}

		super({ ...defaults, ...config });
		
		// This is what the spell scales from.
        this.power = this.player.stats.magic_power / 10;
    }

	setCastEvents(state){
		// Elegible targets for this spell
        this.scene.events[state]('pointerdown:enemy', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
        this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:player', this.clearSpell, this);
	}

    effect(target){
        // Root the target in place.
        target.body.setMaxVelocity(0);
        target.monster.anims.pause();
        target.body.checkCollision.none = true;
        // Also root the player until spell is over or click to move.
        this.player.body.setMaxVelocity(0);
        this.player.idle();
        // Scaled value but cannot crit.
        // const value = this.setValue(10, this.player.stats.magic_power);
        // target.health.adjustValue(-value.amount, this.type, false);

        this.target = target;
        this.scene.events.on('pointerdown:game', this.clearEffect, this);
    }

    clearEffect() {
        // Root the target in place.
        this.target.body.setMaxVelocity(100);
        this.target.monster.anims.resume();
        this.target.body.checkCollision.none = false;
        // Also root the player until spell is over or click to move.
        this.player.body.setMaxVelocity(100);
        this.emitter.stop();

        this.checkAllSpells();

        this.scene.events.emit('spell:cooldown', this);
        this.scene.events.off('pointerdown:game', this.clearEffect, this);
    }

    setParticles() {
        var particles = this.scene.add.particles('siphon-soul');

        this.well = particles.createGravityWell({
            x: this.player.x,
            y: this.player.y,
            power: 2,
            epsilon: 50,
            gravity: 200
        });
    
        this.emitter = particles.createEmitter({
            frame: new Array(5).fill(null).map((a,i)=> `health_glob_00${i}`),
            x: this.target.x,
            y: this.target.y,
            lifespan: 5000,
            speed: 20,
            particleBringToTop: true,
            frequency: 300,
            deathZone: {
                type: 'onEnter',
                source: {
                    contains: (x, y) => this.player.body.hitTest(x, y)
                }
            },
            emitCallback: () => {
                if(this.target.alive) {
                    this.target.health.adjustValue(-this.power, this.type, false);
                } else {
                    this.clearEffect();
                }
            },
            deathCallback: () => {
                this.player.health.adjustValue(this.power, 'heal', false);
            }
        });
    }

    startAnimation() {
        this.disbaleAllSpells();

		this.scene.time.addEvent({
			delay: this.duration * 1000,
			callback: this.clearEffect,
			callbackScope: this
        });
        this.setParticles();
    }

    animationUpdate() {
        console.log("UPDATE")
        this.x = this.target.x;
        this.y = this.target.y;
    }
}

export default SiphonSoul;