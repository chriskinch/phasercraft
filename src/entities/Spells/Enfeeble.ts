import Spell from "./Spell";
import { spellDefDefaults } from "@/types/game";
import { levelFactor, scaleEffect } from "@/lib/levelScaling";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { EffectValue } from "@entities/UI/StatusEffects";

// Enemies have a single `damage` stat (no attack_power/magic_power split), and
// it drives both their melee and ranged hits — so that is what Enfeeble cuts.
interface EnfeebleValue {
    [key: string]: EffectValue;
    damage: (baseDamage: number) => number;
}

export const ENFEEBLE_TINT = 0xaa66cc;

class Enfeeble extends Spell {
    public type: string;
    public duration: number;
    public value: EnfeebleValue;
    // One clear-tint timer per debuffed enemy; recasting on another enemy
    // must not cancel the first one's (it would stay tinted forever).
    public timers = new Map<Enemy, Phaser.Time.TimerEvent>();
    // L1 values; applyLevel() derives duration/value from them.
    private baseDuration!: number;
    private baseValue!: EnfeebleValue;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "enfeeble",
            ...spellDefDefaults("Enfeeble"),
            type: "magic",
            duration: 10,
            value: {
                damage: (bd: number) => -bd * 0.9,
            },
        };

        super({ ...defaults, ...config });
        this.type = "magic";
        this.duration = 10;
        this.value = {
            damage: (bd: number) => -bd * 0.9,
        };
        this.baseDuration = this.duration;
        this.baseValue = this.value;
        this.applyLevel();
    }

    applyLevel(): void {
        this.duration = this.baseDuration * levelFactor(this.spellType, "duration", this.level);
        this.value = scaleEffect(this.spellType, this.baseValue, this.level);
    }

    effect(target: Enemy): void {
        target.banes.addEffect(this);
        target.monster.setTint(ENFEEBLE_TINT);

        this.timers.get(target)?.remove();
        const timer = this.scene.time.addEvent({
            delay: this.duration * 1000 + 1, // Extra ms to ensure the bane has expired first
            callback: this.clearEffect,
            callbackScope: this,
            args: [target],
        });
        this.timers.set(target, timer);
    }

    clearEffect(target: Enemy): void {
        this.timers.delete(target);
        // A dead/despawned enemy's banes are torn down with it; leave it alone.
        if (!target.alive) return;
        if (!target.banes.contains(this)) target.monster.clearTint();
    }

    cleanup(): void {
        this.timers.forEach((timer) => timer.remove());
        this.timers.clear();
        super.cleanup();
    }

    animationUpdate(): void {
        if (this.target && "x" in this.target && "y" in this.target) {
            this.x = this.target.x as number;
            this.y = this.target.y as number;
        }
    }
}

export default Enfeeble;
