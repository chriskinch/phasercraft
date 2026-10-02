import { Geom } from "phaser";
import Spell from "./Spell";
import { playSfx } from "@services/sfx";
import targetVector from "@helpers/targetVector";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { EffectValue } from "@entities/UI/StatusEffects";
import type { GameSceneLike } from "@/types/scene";

const STOMP_PIXEL = "battlestomp-pixel";
const STOMP_PIXEL_SIZE = 4;
const STOMP_RINGS = [0.35, 0.65, 1];
const STOMP_RING_PIXELS = 48;
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
            ...spellDefDefaults("BattleStomp"),
            type: "physical",
            range: 100,
            cap: 5,
            duration: 1.5,
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
        const value = this.setValue({ base: 19, key: "attack_power" });

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

    // Shockwave VFX: concentric rings of pixels (outer = spell range) appear on impact, pops
    // upwards and fades to nothing.
    startAnimation(): void {
        this.clearVfx();
        if (!this.scene.textures.exists(STOMP_PIXEL)) {
            const g = this.scene.make.graphics({}, false);
            g.fillStyle(0xffffff).fillRect(0, 0, STOMP_PIXEL_SIZE, STOMP_PIXEL_SIZE);
            g.generateTexture(STOMP_PIXEL, STOMP_PIXEL_SIZE, STOMP_PIXEL_SIZE);
            g.destroy();
        }

        const x = this.player.x;
        const y = this.player.y + STOMP_FEET_OFFSET;
        playSfx("explosion");
        STOMP_RINGS.forEach((ratio) => this.burst(x, y, ratio));
        this.vfxTimers.push(
            this.scene.time.delayedCall(STOMP_LIFESPAN.max, this.clearVfx, [], this)
        );
    }

    burst(x: number, y: number, ratio: number): void {
        const radius = this.range * ratio;
        const emitter = this.scene.add.particles(x, y, STOMP_PIXEL, {
            emitting: false,
            lifespan: STOMP_LIFESPAN,
            speedX: { min: -8, max: 8 },
            // Fast upward pop that decelerates: the impact.
            speedY: { min: -110, max: -50 },
            gravityY: 90,
            alpha: { start: 1, end: 0 },
            scale: { start: 1.5, end: 0.5 },
            tint: STOMP_COLOURS,
            emitZone: {
                type: "edge",
                // Circle matches targetVector's circular range check.
                source: new Geom.Circle(0, 0, radius),
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
