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
        this.power = this.player.stats.magic_power / 12;
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

        this.target = target;
        this.scene.events.on('pointerdown:game', this.clearEffect, this);
    }

    clearEffect() {
        // Set player and target stats back to normal.
        this.target.body.setMaxVelocity(10000);
        this.target.monster.anims.resume();
        this.target.body.checkCollision.none = false;

        this.player.body.setMaxVelocity(10000);
        this.emitter.stop();
        // We handle when to start the cooldown. Goes with cooldownDelay = true.
        this.cooldownTimer = this.setCooldown();
        this.scene.events.off('pointerdown:game', this.clearEffect, this);
    }

    setParticles() {
        var particles = this.scene.add.particles('siphon-soul');

        this.well = particles.createGravityWell({
            x: this.player.x,
            y: this.player.y,
            power: 2,
            epsilon: 50,
            gravity: 50
        });
    
        this.emitter = particles.createEmitter({
            frame: new Array(5).fill(null).map((a,i)=> `health_glob_00${i}`),
            x: this.target.x,
            y: this.target.y,
            lifespan: 5000,
            speed: 15,
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
        }).setScale(0.5);
    }

    startAnimation() {
		this.scene.time.addEvent({
			delay: this.duration * 1000,
			callback: () => {
                if(!this.enabled) this.clearEffect();
            },
            callbackScope: this,
        });
        this.setParticles();
    }

    animationUpdate() {}
}

export default SiphonSoul;