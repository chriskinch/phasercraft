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
        const centre = this.targetCentre();
        if (centre) this.setPosition(centre.x, centre.y);
    }
}

export default ManaShield;
