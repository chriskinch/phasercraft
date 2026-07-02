import Spell from "./Spell";
import type { SpellOptions } from "@/types/game";
import type Player from "@entities/Player/Player";

class ManaShield extends Spell {
    public type: string;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "manashield",
            icon_name: "icon_0011_freeze",
            cooldown: 10,
            cost: {
                rage: 75,
                mana: 120,
                energy: 70,
            },
            type: "magic",
            cooldownDelay: true,
            loop: true,
            targetKind: "self" as const,
        };
        super({ ...defaults, ...config });
        this.setTint(0x8bc2f8).setAlpha(0.5);
        this.type = "magic";
    }

    effect(target: Player): void {
        this.setVisible(true);
        // Scales value bases on player stat
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
