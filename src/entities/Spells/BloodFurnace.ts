import Spell from "./Spell";
import { spellDefDefaults } from "@/types/game";
import { levelFactor } from "@/lib/levelScaling";
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
    // L1 values; applyLevel() derives the scaled fields from them.
    private base!: { duration: number; hpPerTick: number; manaPerTick: number };

    constructor(config: SpellOptions) {
        const defaults = {
            name: "bloodfurnace",
            ...spellDefDefaults("BloodFurnace"),
            type: "magic",
            duration: 5,
            tickInterval: BLOOD_FURNACE_TICK,
            hpPerTick: BLOOD_FURNACE_HP_PER_TICK,
            manaPerTick: BLOOD_FURNACE_MANA_PER_TICK,
        };

        super({ ...defaults, ...config });
        this.hasAnimation = false;
        const { duration, hpPerTick, manaPerTick } = this;
        this.base = { duration, hpPerTick, manaPerTick };
        this.applyLevel();
    }

    applyLevel(): void {
        this.duration = this.base.duration * levelFactor(this.spellType, "duration", this.level);
        this.hpPerTick = this.base.hpPerTick * levelFactor(this.spellType, "hpPerTick", this.level);
        this.manaPerTick =
            this.base.manaPerTick * levelFactor(this.spellType, "manaPerTick", this.level);
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
