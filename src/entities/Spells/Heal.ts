import Spell from "./Spell";
import type { SpellOptions, TargetType } from "@/types/game";

class Heal extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "heal",
            icon_name: "icon_0015_heal",
            cooldown: 5,
            cost: {
                rage: 25,
                mana: 40,
                energy: 30,
            },
            type: "heal",
            targetKind: "self" as const,
            // Wind-up: interruptible by moving, taking a hit, or casting
            // something else; the resource is only charged on completion.
            castTime: 1,
        };

        super({ ...defaults, ...config });
        this.type = "heal";
    }

    effect(target: TargetType): void {
        if (!target || !("health" in target)) return;
        // Scales value bases on player stat
        const value = this.setValue({ base: 150, key: "magic_power" });
        target.health.adjustValue(value.amount, this.type, value.crit);
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

export default Heal;
