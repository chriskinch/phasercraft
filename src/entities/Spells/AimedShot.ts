import Spell from "./Spell";
import type { SpellOptions, TargetType } from "@/types/game";

class AimedShot extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "aimedshot",
            icon_name: "icon_0007_bolt",
            cooldown: 5,
            cost: {
                rage: 50,
                mana: 50,
                energy: 50,
            },
            type: "physical",
            targetKind: "enemy" as const,
            castRange: 250,
            castTime: 1.25,
            projectile: { key: "multishot-effect", frame: 0, speed: 500 },
        };

        super({ ...defaults, ...config });
        this.type = "physical";
    }

    effect(target: TargetType): void {
        if (!target || !("health" in target)) return;
        const value = this.setValue({ base: 60, key: "attack_power" });
        target.health.adjustValue(-value.amount, this.type, value.crit);
    }
}

export default AimedShot;
