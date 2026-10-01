import Spell from "./Spell";
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

    constructor(config: SpellOptions) {
        const defaults = {
            name: "enfeeble",
            icon_name: "icon_0028_enfeeble",
            cooldown: 5,
            cost: {
                rage: 10,
                mana: 15,
                energy: 10,
            },
            type: "magic",
            duration: 10,
            targetKind: "enemy" as const,
            castRange: 250,
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
