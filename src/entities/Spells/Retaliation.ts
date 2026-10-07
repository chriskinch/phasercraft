import Boon from "./Boon";
import { spellDefDefaults } from "@/types/game";
import { levelFactor } from "@/lib/levelScaling";
import type { SpellOptions } from "@/types/game";
import type { EffectValue } from "@entities/UI/StatusEffects";
import type { IncomingDamage } from "@entities/Player/Player";

// Fraction of melee damage taken that is reflected at the attacker, and removed from the hit (L1).
const BASE_REFLECT = 0.5;

class Retaliation extends Boon {
    public type: string;
    public duration: number;
    // No stat modifiers: the boon only marks the active window.
    public value: Record<string, EffectValue> = {};
    public reflect: number;
    public timer?: Phaser.Time.TimerEvent;
    // Whether the "player:damaged" listener is registered.
    private listening = false;
    private baseDuration!: number;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "retaliation",
            ...spellDefDefaults("Retaliation"),
            type: "physical",
            duration: 5,
            value: {},
        };

        super({ ...defaults, ...config });

        this.hasAnimation = false;
        this.type = "physical";
        this.duration = 5;
        this.reflect = BASE_REFLECT;
        this.baseDuration = this.duration;
        this.applyLevel();
    }

    applyLevel(): void {
        this.duration = this.baseDuration * levelFactor(this.spellType, "duration", this.level);
        this.reflect = BASE_REFLECT * levelFactor(this.spellType, "reflect", this.level);
    }

    effect(): void {
        this.player.boons.addEffect(this);
        this.player.hero.setTint(0x6699ff);

        if (!this.listening) {
            this.scene.events.on("player:damaged", this.counter, this);
            this.listening = true;
        }

        this.timer?.remove();
        this.timer = this.scene.time.addEvent({
            delay: this.duration * 1000 + 1, // Extra ms to ensure effect is over before clearing
            callback: this.clearEffect,
            callbackScope: this,
        });
    }

    // Any enemy attack (melee or ranged): reflect a share of the damage and
    // take that much less.
    counter(incoming: IncomingDamage): void {
        const { attacker } = incoming;
        if (!attacker?.alive) return;
        const power = Math.min(incoming.damage, Math.ceil(incoming.damage * this.reflect));
        if (power <= 0) return;
        incoming.damage -= power;
        attacker.hit({ power, type: "physical" });
    }

    private stopListening(): void {
        if (!this.listening) return;
        this.scene.events.off("player:damaged", this.counter, this);
        this.listening = false;
    }

    clearEffect(): void {
        this.timer = undefined;
        this.stopListening();
        if (!this.player.boons.contains(this)) this.player.hero.clearTint();
    }

    cleanup(): void {
        this.timer?.remove();
        this.timer = undefined;
        this.stopListening();
        super.cleanup();
    }

    setAnimation(): void {}
    animationUpdate(): void {}
}

export default Retaliation;
