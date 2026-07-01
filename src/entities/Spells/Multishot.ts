import { GameObjects } from "phaser";
import Spell from "./Spell";
import targetVector from "@helpers/targetVector";
import type { SpellOptions } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { GameSceneLike } from "@/types/scene";

class Multishot extends Spell {
    public type: string;
    public range: number;
    public cap: number;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "multishot",
            icon_name: "icon_0004_corpse-explode",
            cooldown: 0,
            cost: {
                rage: 50,
                mana: 100,
                energy: 60,
            },
            type: "physical",
            range: 360,
            cap: 3,
            targetKind: "none" as const,
        };

        super({ ...defaults, ...config });
        this.type = "physical";
        this.range = 360;
        this.cap = 3;
    }

    effect(target?: Enemy): void {
        // Scales value bases on player stat.
        if (target) {
            const value = this.setValue({ base: 30, key: "attack_power" });
            target.health.adjustValue(-value.amount, this.type, value.crit);
        }
    }

    startAnimation(): void {
        const enemiesInRange: Enemy[] = (
            (this.scene as GameSceneLike).enemies.children.entries as unknown as Enemy[]
        )
            .filter((enemy: Enemy) => {
                enemy.vector = targetVector(this.player, enemy);
                if ((enemy.vector?.range ?? 0) < this.range) return enemy;
                return null;
            })
            .sort(function (a: Enemy, b: Enemy) {
                return (a.vector?.range ?? 0) - (b.vector?.range ?? 0);
            })
            .slice(0, this.cap);

        enemiesInRange.forEach((enemy: Enemy) => {
            this.target = enemy;
            this.effect(enemy);

            const sprite = this.scene.add.sprite(100, 100, "multishot-effect");
            sprite.anims.play("multishot-animation");
            const animation = sprite.setDepth(1000).on("animationupdate", () => {
                this.updateAnimation(animation, enemy);
            });
        });
    }

    updateAnimation(effect: GameObjects.Sprite, target: Enemy): void {
        effect.x = target.x;
        effect.y = target.y;
    }
}

export default Multishot;
