import Spell from "./Spell";
import type { SpellOptions } from "@/types/game";
import type Player from "@entities/Player/Player";

class Faith extends Spell {
    public frequency: number;
    public duration: number;
    public type: string;
    public timer!: Phaser.Time.TimerEvent;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "faith",
            icon_name: "icon_0026_regen",
            cooldown: 20,
            cost: {
                rage: 15,
                mana: 30,
                energy: 20,
            },
            frequency: 2,
            duration: 10,
            type: "heal",
            targetKind: "self" as const,
        };

        super({ ...defaults, ...config });

        this.frequency = 2;
        this.duration = 10;
        this.type = "heal";

        this.scene.events.once("player:dead", this.clearEffect, this);
    }

    effect(target: Player): void {
        const timer_config = {
            delay: this.frequency * 1000,
            repeat: Math.round(this.duration / this.frequency) - 1,
            callback: this.overTimeEffect,
            args: [target],
            callbackScope: this,
        };
        this.timer = this.scene.time.addEvent(timer_config);
        const value = this.setValue({ base: 20, key: "magic_power" });
        target.health.adjustValue(value.amount, this.type, false);
    }

    overTimeEffect(target: Player): void {
        // Scales value bases on player stat
        const value = this.setValue({ base: 20, key: "magic_power" });
        target.health.adjustValue(value.amount, this.type, value.crit);
    }

    clearEffect(): void {
        if (this.timer) this.timer.remove();
    }

    animationUpdate(): void {
        if (
            this.target &&
            typeof this.target === "object" &&
            "x" in this.target &&
            "y" in this.target
        ) {
            this.x = this.target.x as number;
            this.y = this.target.y as number;
        }
    }
}

export default Faith;
