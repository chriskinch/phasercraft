import Spell from "./Spell";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions, TargetType } from "@/types/game";

// Ranger single-target nuke: long interruptible wind-up, then a homing
// arrow that deals heavy physical damage on impact. Numbers are proposals.
class AimedShot extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "aimed-shot",
            ...spellDefDefaults("AimedShot"),
            type: "physical",
            // Wind-up: interruptible by moving, taking a hit, or casting
            // something else; the resource is only charged on completion.
            castTime: 1.25,
            projectile: { key: "multishot-effect", frame: 0, speed: 600 },
        };

        super({ ...defaults, ...config });
        this.type = "physical";
        // No "aimed-shot-effect" spritesheet: playing the empty impact
        // animation on hit crashes, so the arrow itself is the only VFX.
        this.hasAnimation = false;
    }

    effect(target: TargetType): void {
        if (!target || !("health" in target)) return;
        const value = this.setValue({ base: 100, key: "attack_power" });
        target.health.adjustValue(-value.amount, this.type, value.crit);
    }
}

export default AimedShot;
