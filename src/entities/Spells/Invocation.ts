import Boon from "./Boon";
import type { SpellOptions } from "@/types/game";
import type { EffectValue } from "@entities/UI/StatusEffects";

// Index signature lets the concrete stat-modifier map satisfy the
// `Record<string, EffectValue>` that StatusEffects (Boons/Banes) consumes.
interface InvocationValue {
    [key: string]: EffectValue;
    resource_regen_value: (baseRegenValue: number) => number;
    resource_regen_rate: number;
}

class Invocation extends Boon {
    public type!: string;
    public duration!: number;
    public value!: InvocationValue;
    public timer!: Phaser.Time.TimerEvent;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "invocation",
            icon_name: "icon_0014_haste",
            cooldown: 60,
            cost: {
                rage: 0,
                mana: 0,
                energy: 0,
            },
            type: "magic",
            duration: 5,
            targetKind: "self" as const,
            // Modelled as a channel: the controller roots the player, shows
            // the cast bar, and breaks it on move/hit/new cast.
            channelDuration: 5,
            value: {
                resource_regen_value: (bs: number) => bs * 4, // Increase by 400%
                resource_regen_rate: -0.1, // Tick 0.1s more frequently
            },
        };

        super({ ...defaults, ...config });
        this.hasAnimation = false;
    }

    effect(): void {
        this.player.boons.addEffect(this);
        this.player.hero.setTint(0x8bc2f8);

        const timer_config = {
            delay: this.duration * 1000 + 1, // Extra ms to ensure effect is over before clearing
            callback: this.clearEffect,
            callbackScope: this,
        };
        this.timer = this.scene.time.addEvent(timer_config);

        // Also root the player until the channel ends or is broken; the
        // CastingController calls interruptChannel on move/hit/new cast.
        this.player.body.setMaxVelocity(10);
        this.player.root();
    }

    // Channel broken early — restore the player just like a natural end.
    interruptChannel(): void {
        this.clearEffect();
    }

    clearEffect(): void {
        this.player.idle();
        this.player.hero.clearTint();
        // Set player stats back to normal.
        this.player.body.setMaxVelocity(10000);
    }

    setAnimation(): void {}
    animationUpdate(): void {}
}

export default Invocation;
