import Spell from './Spell';

class SiphonSoul extends Spell {
	constructor(config) {
		const defaults = {
            name: "siphonsoul",
			icon_name: 'icon_0000_death',
			cooldown: 5,
			cost: {
				rage: 60,
				mana: 100,
				energy: 60
			},
            type: 'magic',
            duration: 5,
            cooldownDelayAll: true
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

        // We handle when to start the cooldown. Goes with cooldownDelayAll = true.
        this.customAnimationTimer.remove();
        this.cooldownTimer = this.setCooldown();
        this.scene.events.emit('spell:enableall', this);
        this.scene.events.off('pointerdown:game', this.clearEffect, this);
    }

setParticles() {
    const value = this.setValue({ base: 10, key: "magic_power", reducer: v => v/5});
    
    // Modern Phaser 3.90+ particle system
    this.emitter = this.scene.add.particles(this.target.x, this.target.y, 'siphon-soul', {
        frame: new Array(5).fill(null).map((a,i)=> `health_glob_00${i}`),
        lifespan: 5000,
        speed: 15,
        frequency: 300,
        scale: 0.75,
        emitting: true
    });

    // Add custom gravity behavior using the processor system
    this.emitter.addParticleProcessor('gravity', (particle, delta) => {
        // Calculate direction and distance to player
        const dx = this.player.x - particle.x;
        const dy = this.player.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 32) {
            // Apply gravity force toward player
            const force = 100 / Math.max(distance, 50);
            const normalizedDx = dx / distance;
            const normalizedDy = dy / distance;
            
            particle.velocityX += normalizedDx * force * (delta / 16);
            particle.velocityY += normalizedDy * force * (delta / 16);
        } else {
            // Particle reached player - heal and remove
            this.player.health.adjustValue(value.amount, 'heal', false);
            particle.kill();
        }
    });

    // Handle damage on emit
    this.emitter.onParticleEmit = (particle) => {
        if(this.target && this.target.alive) {
            this.target.health.adjustValue(-value.amount, this.type, false);
        } else {
            this.clearEffect();
        }
    };
}

    startAnimation() {
		this.customAnimationTimer = this.scene.time.addEvent({
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