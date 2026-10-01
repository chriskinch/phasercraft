import { Geom } from "phaser";
import Spell from "./Spell";
import targetVector from "@helpers/targetVector";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { EffectValue } from "@entities/UI/StatusEffects";
import type { GameSceneLike } from "@/types/scene";

const STOMP_PIXEL = "battlestomp-pixel";
const STOMP_RINGS = [0.35, 0.65, 1];
const STOMP_RING_DELAY = 70; // ms between rings
const STOMP_RING_PIXELS = 40;
const STOMP_LIFESPAN = { min: 450, max: 750 };
const STOMP_FEET_OFFSET = 12;
const STOMP_COLOURS = [0xffffff, 0xe8d8a8, 0xc8a870];

class BattleStomp extends Spell {
    public type: string;
    public range: number;
    public cap: number;
    public duration: number;
    public value: Record<string, EffectValue> = {};
    public stun = true;
    public emitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
    public vfxTimers: Phaser.Time.TimerEvent[] = [];

    constructor(config: SpellOptions) {
        const defaults = {
            name: "battlestomp",
            icon_name: "icon_0005_coil",
            cooldown: 6,
            cost: {
                rage: 30,
                mana: 60,
                energy: 40,
            },
            type: "physical",
            range: 100,
            cap: 5,
            duration: 1.5,
            targetKind: "self" as const,
        };

        super({ ...defaults, ...config });

        this.hasAnimation = true;
        this.type = "physical";
        this.range = 100;
        this.cap = 5;
        this.duration = 1.5;
    }

    effect(): void {
        const enemiesInRange = (
            (this.scene as GameSceneLike).enemies.getChildren() as Enemy[]
        ).filter((enemy: Enemy) => {
            enemy.vector = targetVector(this.player, enemy);
            return !!enemy.vector?.range && enemy.vector.range < this.range;
        });

        // Same pack cap as Whirlwind (duplicated; see the TODO there).
        const mod = this.powerCap(enemiesInRange);
        const value = this.setValue({ base: 25, key: "attack_power" });

        enemiesInRange.forEach((enemy: Enemy) => {
            if (!enemy?.health) return;
            enemy.health.adjustValue(-value.amount * mod, this.type, value.crit);
            enemy.banes.addEffect(this);
        });
    }

    powerCap(enemies: Enemy[]): number {
        return this.cap / Math.max(this.cap, enemies.length);
    }

    // No spritesheet: the shockwave is built from particles in startAnimation().
    setAnimation(): void {}

    // Shockwave VFX: rings of pixels erupt from the ground at growing radii,
    // drift upwards and fade to nothing.
    startAnimation(): void {
        this.clearVfx();
        if (!this.scene.textures.exists(STOMP_PIXEL)) {
            const g = this.scene.make.graphics({}, false);
            g.fillStyle(0xffffff).fillRect(0, 0, 2, 2);
            g.generateTexture(STOMP_PIXEL, 2, 2);
            g.destroy();
        }

        const x = this.player.x;
        const y = this.player.y + STOMP_FEET_OFFSET;
        STOMP_RINGS.forEach((ratio, i) => {
            this.vfxTimers.push(
                this.scene.time.delayedCall(i * STOMP_RING_DELAY, () => this.burst(x, y, ratio))
            );
        });
        this.vfxTimers.push(
            this.scene.time.delayedCall(
                STOMP_RINGS.length * STOMP_RING_DELAY + STOMP_LIFESPAN.max,
                this.clearVfx,
                [],
                this
            )
        );
    }

    burst(x: number, y: number, ratio: number): void {
        const radius = this.range * ratio;
        const emitter = this.scene.add.particles(x, y, STOMP_PIXEL, {
            emitting: false,
            lifespan: STOMP_LIFESPAN,
            speedX: { min: -8, max: 8 },
            speedY: { min: -40, max: -15 },
            gravityY: -30,
            alpha: { start: 1, end: 0 },
            scale: { start: 1.5, end: 0.5 },
            tint: STOMP_COLOURS,
            emitZone: {
                type: "edge",
                // Flattened ellipse reads as a ring on the ground plane.
                source: new Geom.Ellipse(0, 0, radius * 2, radius),
                quantity: STOMP_RING_PIXELS,
            },
        });
        emitter.setDepth(y);
        emitter.explode(STOMP_RING_PIXELS);
        this.emitters.push(emitter);
    }

    clearVfx(): void {
        this.vfxTimers.forEach((timer) => timer.remove());
        this.vfxTimers = [];
        this.emitters.forEach((emitter) => emitter.destroy());
        this.emitters = [];
    }

    cleanup(): void {
        this.clearVfx();
        super.cleanup();
    }

    animationUpdate(): void {
        this.x = this.player.x;
        this.y = this.player.y;
    }
}

export default BattleStomp;
