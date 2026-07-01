import Spell from "./Spell";
import targetVector from "@helpers/targetVector";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { GameSceneLike } from "@/types/scene";
class Whirlwind extends Spell {
    public type: string;
    public range: number;
    public cap: number;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "whirlwind",
            icon_name: "icon_0005_coil",
            cooldown: 2,
            cost: {
                rage: 50,
                mana: 80,
                energy: 60,
            },
            type: "physical",
            range: 120,
            cap: 5,
            targetKind: "none" as const,
        };

        super({ ...defaults, ...config });

        this.setScale(2);
        this.type = "physical";
        this.range = 120;
        this.cap = 5;
    }

    effect(target?: Enemy): void {
        const enemiesInRange = (
            (this.scene as GameSceneLike).enemies.children.entries as unknown as Enemy[]
        )
            .filter((enemy: Enemy) => {
                enemy.vector = targetVector(this.player, enemy);
                if (enemy?.vector?.range && enemy.vector.range < this.range) return enemy;
                return null;
            })
            .sort(function (a: Enemy, b: Enemy) {
                return (a.vector?.range ?? 0) - (b.vector?.range ?? 0);
            });

        // Modified if more the cap. This ensure that the spell is not massively overpowered.
        // TODO: Abstract this capping functionality out as many spells might use.
        const mod = this.powerCap(enemiesInRange);
        // Scales value bases on player stat.
        const value = this.setValue({ base: 30, key: "attack_power" });

        enemiesInRange.forEach((target: Enemy) => {
            if (target && target.health) {
                target.health.adjustValue(-value.amount * mod, this.type, value.crit);
            }
        });
    }

    powerCap(enemies: Enemy[]): number {
        const split = enemies.length < this.cap ? this.cap : enemies.length;
        const spread = this.cap / split;
        return spread;
    }

    animationUpdate(): void {
        this.x = this.player.x;
        this.y = this.player.y;
    }
}

export default Whirlwind;
