import Spell from "./Spell";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";

class Smite extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "smite",
            icon_name: "icon_0007_bolt",
            cooldown: 3,
            cost: {
                rage: 30,
                mana: 50,
                energy: 40,
            },
            type: "magic",
            targetKind: "enemy" as const,
            castRange: 300,
        };

        super({ ...defaults, ...config });
        this.type = "magic";
    }

    effect(target: Enemy): void {
        // Returns crit boolean and modified value using spell base value.
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
