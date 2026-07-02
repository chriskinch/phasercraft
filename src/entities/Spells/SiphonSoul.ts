import Spell from "./Spell";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";

class SiphonSoul extends Spell {
    public type!: string;
    public duration!: number;
    public particleDuration: number;
    public power: number;
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter | undefined;
    public gravityWell: Phaser.GameObjects.Particles.GravityWell | undefined;
    public durationAnimationTimer!: Phaser.Time.TimerEvent;
    public particleAnimationTimer!: Phaser.Time.TimerEvent;
    public debugGraphics!: Phaser.GameObjects.Graphics;
    public deathZone: Phaser.Geom.Circle;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "siphonsoul",
            icon_name: "icon_0000_death",
            cooldown: 5,
            cost: {
                rage: 60,
                mana: 100,
                energy: 60,
            },
            type: "magic",
            duration: 5,
            cooldownDelayAll: true,
            targetKind: "enemy" as const,
            castRange: 200,
            // The controller holds the casting state for the channel and
            // breaks it (via interruptChannel) on move/hit/new cast.
            channelDuration: 5,
        };

        super({ ...defaults, ...config });

        // This is what the spell scales from. Player stats always include
        // magic_power; the `?? 0` only satisfies the optional type.
        this.power = (this.player.stats.magic_power ?? 0) / 10;
        this.deathZone = new Phaser.Geom.Circle(this.player.x, this.player.y, 20);
        this.particleDuration = this.duration + this.cooldown;
    }

    effect(target: Enemy): void {
        // Root the target in place.
        target.body.setMaxVelocity(0, 0);
        target.monster.anims.pause();
        target.body.checkCollision.none = true;
        // Also root the player until spell is over or click to move; the
        // CastingController breaks the channel on a move tap and calls
        // interruptChannel, which unroots both.
        this.player.body.setMaxVelocity(0, 0);
        this.player.idle();

        this.target = target;
    }

    // Channel broken early (move command, taking a hit, or another cast).
    interruptChannel(): void {
        this.clearEffect();
    }

    setParticles(): void {
        if (!this.target) return;
        const value = this.setValue({ base: 10, key: "magic_power", reducer: (v) => v / 10 });
        const target = this.target as Enemy;

        this.emitter = this.scene.add.particles(target.x, target.y, "siphon-soul", {
            frame: new Array(5).fill(null).map((a, i) => `health_glob_00${i}`),
            lifespan: this.particleDuration * 1000,
            speed: 15,
            frequency: 150,
            scale: 0.75,
            emitting: true,
            deathZone: [
                {
                    type: "onEnter",
                    source: this.deathZone,
                },
            ],
        });

        const relativePlayerX = this.player.x - target.x;
        const relativePlayerY = this.player.y - target.y;
        this.gravityWell = this.emitter.createGravityWell({
            x: relativePlayerX,
            y: relativePlayerY,
            power: 1,
            epsilon: 50,
            gravity: 20,
        });

        this.scene.events.on("update", this.updateGravityWellPosition, this);

        this.emitter.onParticleEmit(() => {
            if ((this.target as Enemy).alive) {
                (this.target as Enemy).health.adjustValue(-value.amount, this.type, false);
            }
        });

        this.emitter.onParticleDeath(() => {
            this.player.health.adjustValue(value.amount, "heal", false);
        });
    }

    // Update gravity well position to follow the player
    updateGravityWellPosition(): void {
        if (this.gravityWell && this.player && this.target) {
            // Update gravity well position relative to emitter
            const newRelativeX = this.player.x - (this.target as Enemy).x;
            const newRelativeY = this.player.y - (this.target as Enemy).y;
            this.gravityWell.x = newRelativeX;
            this.gravityWell.y = newRelativeY;
        }

        if (this.deathZone) {
            this.deathZone.x = this.player.x;
            this.deathZone.y = this.player.y;
        }
    }

    clearEffect(): void {
        // Set player and target stats back to normal.
        if (
            this.target &&
            typeof this.target === "object" &&
            "body" in this.target &&
            "monster" in this.target
        ) {
            (this.target as Enemy).body.setMaxVelocity(10000, 10000);
            (this.target as Enemy).monster.anims.resume();
            (this.target as Enemy).body.checkCollision.none = false;
        }

        this.player.body.setMaxVelocity(10000, 10000);

        if (this.emitter) {
            this.emitter.stop();
        }

        // We handle when to start the cooldown. Goes with cooldownDelayAll = true.
        this.durationAnimationTimer.remove();
        this.cooldownTimer = this.setCooldown();
        this.scene.events.emit("spell:enableall", this);
    }

    clearParticleEffect(): void {
        // Stop emitter but let existing particles live out their lifespan
        if (this.emitter && this.gravityWell) {
            this.emitter.destroy();
            this.emitter = undefined;
            this.gravityWell.destroy();
            this.gravityWell = undefined;
        }
        this.scene.events.off("update", this.updateGravityWellPosition, this);
        this.particleAnimationTimer.remove();
    }

    startAnimation(): void {
        this.durationAnimationTimer = this.scene.time.addEvent({
            delay: this.duration * 1000,
            callback: () => {
                if (!this.enabled) this.clearEffect();
            },
            callbackScope: this,
        });
        this.particleAnimationTimer = this.scene.time.addEvent({
            delay: this.particleDuration * 1000,
            callback: () => {
                this.clearParticleEffect();
            },
            callbackScope: this,
        });
        this.setParticles();
    }

    animationUpdate(): void {}
}

export default SiphonSoul;
