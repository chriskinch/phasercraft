import Spell from "./Spell";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions, TargetType } from "@/types/game";

class Fireball extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "fireball",
            ...spellDefDefaults("Fireball"),
            type: "magic",
            projectile: { key: "fireball-effect", frame: 0, speed: 400 },
        };

        super({ ...defaults, ...config });
        this.type = "magic";
    }

    effect(target: TargetType): void {
        if (!target || !("health" in target)) return;
        const value = this.setValue({ base: 45, key: "magic_power" });
        target.health.adjustValue(-value.amount, this.type, value.crit);
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

export default Fireball;
