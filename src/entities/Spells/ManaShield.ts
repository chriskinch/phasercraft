import Spell from "./Spell";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions } from "@/types/game";
import type Player from "@entities/Player/Player";

class ManaShield extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "manashield",
            ...spellDefDefaults("ManaShield"),
            type: "magic",
            cooldownDelay: true,
            loop: true,
        };
        super({ ...defaults, ...config });
        this.setTint(0x8bc2f8).setAlpha(0.5);
        this.type = "magic";
    }

    effect(target: Player): void {
        this.setVisible(true);
        const value = this.setValue({ base: 130, key: "magic_power" });
        target.shield.adjustValue(value.amount);
        target.shield.once("shield:depleted", this.end, this);
    }

    end(): void {
        this.cooldownTimer = this.setCooldown();
        this.monitorSpell();
        this.setVisible(false);
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

export default ManaShield;
