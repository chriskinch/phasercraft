import Boon from "./Boon";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions } from "@/types/game";
import type { EffectValue } from "@entities/UI/StatusEffects";

// `attack_speed` is an interval in seconds (Player.attack uses
// `delay: attack_speed * 1000`), so a negative modifier means faster attacks.
interface FocusValue {
    [key: string]: EffectValue;
    critical_chance: number;
    attack_speed: (baseAttackSpeed: number) => number;
}

const FOCUS_VALUE: FocusValue = {
    critical_chance: 15,
    attack_speed: (bs: number) => bs * -0.25, // 25% shorter attack interval
};

class Focus extends Boon {
    public type: string;
    public duration: number;
    public value: FocusValue;
    public timer?: Phaser.Time.TimerEvent;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "focus",
            ...spellDefDefaults("Focus"),
            type: "physical",
            duration: 6,
            value: FOCUS_VALUE,
        };

        super({ ...defaults, ...config });

        this.hasAnimation = false;
        this.type = "physical";
        this.duration = 6;
        this.value = FOCUS_VALUE;
    }

    effect(): void {
        this.player.boons.addEffect(this);
        this.player.hero.setTint(0x66ff99);

        this.timer?.remove();
        this.timer = this.scene.time.addEvent({
            delay: this.duration * 1000 + 1, // Extra ms to ensure effect is over before clearing
            callback: this.clearEffect,
            callbackScope: this,
        });
    }

    clearEffect(): void {
        this.timer = undefined;
        if (!this.player.boons.contains(this)) this.player.hero.clearTint();
    }

    cleanup(): void {
        this.timer?.remove();
        this.timer = undefined;
        super.cleanup();
    }

    setAnimation(): void {}
    animationUpdate(): void {}
}

export default Focus;
