import Spell from "./Spell";
import Projectile from "@entities/Weapons/Projectile";
import targetVector from "@helpers/targetVector";
import { spellDefDefaults } from "@/types/game";
import type { SpellOptions, TargetType } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { GameSceneLike } from "@/types/scene";

class Multishot extends Spell {
    public type: string;
    public range: number;
    public cap: number;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "multishot",
            ...spellDefDefaults("Multishot"),
            type: "physical",
            range: 250,
            cap: 3,
        };

        super({ ...defaults, ...config });
        this.type = "physical";
        this.range = 250;
        this.cap = 3;
    }

    effect(target?: Enemy): void {
        if (target) {
            const value = this.setValue({ base: 30, key: "attack_power" });
            target.health.adjustValue(-value.amount, this.type, value.crit);
        }
    }

    // Like Aimed Shot's castRange: with no enemy inside `range` the cast
    // does not trigger — no arrows, no resource spent, no cooldown.
    castSpell(target?: TargetType): void {
        if (this.enemiesInRange().length === 0) return;
        super.castSpell(target);
    }

    // Up to `cap` live enemies within `range`, nearest first.
    enemiesInRange(): Enemy[] {
        // getChildren(): `children.entries` stopped being an array in Phaser 4
        // (children is a plain array there), which made this scan throw.
        return ((this.scene as GameSceneLike).enemies.getChildren() as Enemy[])
            .filter((enemy: Enemy) => {
                enemy.vector = targetVector(this.player, enemy);
                return (enemy.vector?.range ?? 0) < this.range;
            })
            .sort(function (a: Enemy, b: Enemy) {
                return (a.vector?.range ?? 0) - (b.vector?.range ?? 0);
            })
            .slice(0, this.cap);
    }

    startAnimation(): void {
        const enemiesInRange = this.enemiesInRange();

        // One homing arrow per target; the damage lands on impact.
        enemiesInRange.forEach((enemy: Enemy) => {
            this.target = enemy;
            new Projectile({
                scene: this.scene,
                x: this.player.x,
                y: this.player.y - 10,
                key: "multishot-effect",
                frame: 0,
                speed: 500,
                target: enemy,
                onImpact: (impacted) => this.effect(impacted as Enemy),
            });
        });
    }
}

export default Multishot;
