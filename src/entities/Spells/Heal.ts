import Spell from "./Spell";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions, TargetType } from "@/types/game";

class Heal extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "heal",
            ...spellDefDefaults("Heal"),
            type: "heal",
            // Wind-up: interruptible by moving, taking a hit, or casting
            // something else; the resource is only charged on completion.
            castTime: 1,
        };

        super({ ...defaults, ...config });
        this.type = "heal";
    }

    effect(target: TargetType): void {
        if (!target || !("health" in target)) return;
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
