import Spell from "./Spell";
import type { SpellOptions } from "@/types/game";

// Proposed balance (tuned in PR review): 10 ticks over 5s, 300 HP → 250 Mana.
export const BLOOD_FURNACE_TICK = 0.5;
export const BLOOD_FURNACE_HP_PER_TICK = 30;
export const BLOOD_FURNACE_MANA_PER_TICK = 25;

// Self-cast Life-Tap over time: drains the Occultist's health and restores
// Mana each tick. Runs passively (no channel lock) and never kills the player.
class BloodFurnace extends Spell {
    public type!: string;
    public duration!: number;
    public tickInterval!: number;
    public hpPerTick!: number;
    public manaPerTick!: number;
    public tickTimer: Phaser.Time.TimerEvent | undefined;
    public durationTimer: Phaser.Time.TimerEvent | undefined;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "bloodfurnace",
            icon_name: "icon_0036_blood-furnace",
            cooldown: 15,
            cost: {
                rage: 0,
                mana: 0,
                energy: 0,
            },
            type: "magic",
            duration: 5,
            tickInterval: BLOOD_FURNACE_TICK,
            hpPerTick: BLOOD_FURNACE_HP_PER_TICK,
            manaPerTick: BLOOD_FURNACE_MANA_PER_TICK,
            targetKind: "self" as const,
        };

        super({ ...defaults, ...config });
        this.hasAnimation = false;
    }

    effect(): void {
        this.endFurnace();
        const ticks = Math.round(this.duration / this.tickInterval);
        this.tickTimer = this.scene.time.addEvent({
            delay: this.tickInterval * 1000,
            repeat: ticks - 1,
            callback: this.burn,
            callbackScope: this,
        });
        this.durationTimer = this.scene.time.addEvent({
            delay: this.duration * 1000 + 1,
            callback: this.endFurnace,
            callbackScope: this,
        });
        this.scene.events.once("player:dead", this.endFurnace, this);
    }

    burn(): void {
        const { health, resource } = this.player;
        // Never let a tick kill the player: end early instead of burning the last HP.
        if (!this.player.alive || health.getValue() - this.hpPerTick <= 0) {
            this.endFurnace();
            return;
        }
        health.adjustValue(-this.hpPerTick, "physical", false);
        resource.adjustValue(this.manaPerTick);
    }

    endFurnace(): void {
        this.tickTimer?.remove();
        this.tickTimer = undefined;
        this.durationTimer?.remove();
        this.durationTimer = undefined;
        this.scene?.events.off("player:dead", this.endFurnace, this);
    }

    cleanup(): void {
        this.endFurnace();
        super.cleanup();
    }
}

export default BloodFurnace;
