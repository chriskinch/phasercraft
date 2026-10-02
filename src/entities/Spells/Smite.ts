import Spell from "./Spell";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";

class Smite extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "smite",
            ...spellDefDefaults("Smite"),
            type: "magic",
        };

        super({ ...defaults, ...config });
        this.type = "magic";
    }

    effect(target: Enemy): void {
        const value = this.setValue({ base: 30, key: "magic_power" });
        const heal = this.setValue({ base: 15, key: "magic_power" });
        this.player.health.adjustValue(heal.amount, "heal", heal.crit);
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
            this.y = (this.target.y as number) - 40;
        }
    }
}

export default Smite;
