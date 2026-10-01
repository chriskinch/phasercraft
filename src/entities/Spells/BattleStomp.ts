import Spell from "./Spell";
import targetVector from "@helpers/targetVector";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { EffectValue } from "@entities/UI/StatusEffects";
import type { GameSceneLike } from "@/types/scene";

class BattleStomp extends Spell {
    public type: string;
    public range: number;
    public cap: number;
    public duration: number;
    public value: Record<string, EffectValue> = {};
    public stun = true;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "battlestomp",
            icon_name: "icon_0005_coil",
            cooldown: 6,
            cost: {
                rage: 30,
                mana: 60,
                energy: 40,
            },
            type: "physical",
            range: 100,
            cap: 5,
            duration: 1.5,
            targetKind: "self" as const,
        };

        super({ ...defaults, ...config });

        this.setScale(2);
        this.type = "physical";
        this.range = 100;
        this.cap = 5;
        this.duration = 1.5;
    }

    effect(): void {
        const enemiesInRange = (
            (this.scene as GameSceneLike).enemies.getChildren() as Enemy[]
        ).filter((enemy: Enemy) => {
            enemy.vector = targetVector(this.player, enemy);
            return !!enemy.vector?.range && enemy.vector.range < this.range;
        });

        // Same pack cap as Whirlwind (duplicated; see the TODO there).
        const mod = this.powerCap(enemiesInRange);
        const value = this.setValue({ base: 25, key: "attack_power" });

        enemiesInRange.forEach((enemy: Enemy) => {
            if (!enemy?.health) return;
            enemy.health.adjustValue(-value.amount * mod, this.type, value.crit);
            enemy.banes.addEffect(this);
        });
    }

    powerCap(enemies: Enemy[]): number {
        return this.cap / Math.max(this.cap, enemies.length);
    }

    animationUpdate(): void {
        this.x = this.player.x;
        this.y = this.player.y;
    }
}

export default BattleStomp;
