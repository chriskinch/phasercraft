import { Math as PhaserMath } from "phaser";
import Spell from "./Spell";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions, TargetType } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { EffectValue } from "@entities/UI/StatusEffects";

// Dash speed in px/s (player walk speed is ~100).
export const CHARGE_SPEED = 600;
// Must be further than this to charge (outside melee range).
export const CHARGE_MIN_RANGE = 80;
// Stop this far short of the target's centre so bodies don't overlap.
export const CHARGE_STOP_DISTANCE = 30;

class Charge extends Spell {
    public type: string;
    // Bane metadata: a brief stun (root + no attacks; also breaks enemy casts).
    public duration: number;
    public value: Record<string, EffectValue> = {};
    public stun = true;
    // Read by the CastingController: targets closer than this prime instead.
    public minCastRange = CHARGE_MIN_RANGE;
    public dashTween?: Phaser.Tweens.Tween;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "charge",
            ...spellDefDefaults("Charge"),
            type: "physical",
            duration: 1,
        };

        super({ ...defaults, ...config });

        this.hasAnimation = false;
        this.type = "physical";
        this.duration = 1;
        this.minCastRange = CHARGE_MIN_RANGE;
    }

    // Min-range gate: too close casts nothing and costs nothing.
    castSpell(target?: TargetType): void {
        const enemy = target as Enemy | undefined;
        if (!enemy?.alive) return;
        if (this.distanceTo(enemy) < CHARGE_MIN_RANGE) return;
        super.castSpell(target);
    }

    distanceTo(target: { x: number; y: number }): number {
        return PhaserMath.Distance.Between(this.player.x, this.player.y, target.x, target.y);
    }

    effect(target: TargetType | undefined): void {
        const enemy = target as Enemy;
        this.stopDash();

        const startX = this.player.x;
        const startY = this.player.y;
        const duration = (this.distanceTo(enemy) / CHARGE_SPEED) * 1000;

        this.player.dashing = true;
        this.player.body.setVelocity(0);
        this.player.destination = { x: enemy.x, y: enemy.y };
        this.player.walk();

        this.dashTween = this.scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration,
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                if (!enemy.alive) {
                    this.stopDash();
                    return;
                }
                // Track the live target, stopping just short of it.
                const t = tween.getValue() ?? 0;
                const dx = enemy.x - startX;
                const dy = enemy.y - startY;
                const len = Math.hypot(dx, dy) || 1;
                const reach = Math.max(0, len - CHARGE_STOP_DISTANCE) / len;
                this.player.setPosition(startX + dx * reach * t, startY + dy * reach * t);
            },
            onComplete: () => this.impact(enemy),
        });
    }

    impact(enemy: Enemy): void {
        this.stopDash();
        if (!enemy.alive) return;
        const value = this.setValue({ base: 20, key: "attack_power" });
        enemy.hit({ power: value.amount, type: this.type, crit: value.crit });
        // Stun bane: Enemy.update roots it while stunned; Banes clears it on expiry.
        if (enemy.alive) enemy.banes.addEffect(this);
    }

    // Idempotent: ends the dash and hands movement back to the player.
    stopDash(): void {
        if (this.dashTween) {
            this.dashTween.remove();
            this.dashTween = undefined;
        }
        if (this.player?.dashing) {
            this.player.dashing = false;
            this.player.idle();
        }
    }

    cleanup(): void {
        if (!this.scene) return;
        this.stopDash();
        super.cleanup();
    }

    // No spritesheet: the dash itself is the visual.
    setAnimation(): void {}
    animationUpdate(): void {}
}

export default Charge;
