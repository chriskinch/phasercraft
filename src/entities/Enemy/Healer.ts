import Enemy from "./Enemy";
import type { EnemyOptions } from "@/types/game";
class Healer extends Enemy {
    // The pending heal cast, removed in cleanup() so a dead healer can't land it.
    public heal_timer: Phaser.Time.TimerEvent | null = null;

    constructor(config: EnemyOptions) {
        const defaults = {
            circling_radius: 70,
            aggro_radius: 40,
        };
        super({ ...defaults, ...config });

        this.once("enemy:last", this.lastStanding, this);
    }

    update(time?: number, delta?: number): void {
        super.update(time ?? 0, delta ?? 0);

        if (this.active_group.getChildren().length === 1) this.emit("enemy:last", this);

        // Scan only when primed (getHealTarget is pure), once, and hand the
        // result to healTarget rather than letting it re-scan.
        if (this.states.attack === "primed") {
            const target = this.getHealTarget();
            if (target) this.healTarget(target);
        }

        if (this.isInCirclingDistance()) {
            if (!this.circling)
                this.setCircling({
                    from: 1,
                    to: -0.5,
                    delay: Math.random() * 1000,
                    duration: 1000,
                    repeat: Math.floor(Math.random() * 5),
                    completeDelay: 2000 + Math.random() * 5000,
                });
        }
    }

    // The other enemy missing the most health; ties go to the first in group
    // order. One allocation-free pass over the group's Set (getChildren()
    // copies it); equivalent to the old filter(missing > 0, not self) + lodash
    // maxBy: every candidate is a number > 0, so maxBy's NaN/undefined
    // handling never applies, and its strict `>` keeps the first max.
    getHealTarget(): Enemy | undefined {
        let best: Enemy | undefined;
        let bestMissing = 0;
        for (const child of this.active_group.children) {
            const enemy = child as Enemy;
            const missing = this.getMissingHealth(enemy);
            // bestMissing starts at 0, so this also enforces missing > 0.
            if (enemy !== this && missing > bestMissing) {
                best = enemy;
                bestMissing = missing;
            }
        }
        return best;
    }

    healTarget(target: Enemy | undefined = this.getHealTarget()): void {
        this.states.attack = "casting";
        this.heal_timer = this.scene.time.addEvent({
            delay: 3000,
            callback: (t: Enemy) => {
                this.heal_timer = null;
                // The death animation runs before destroy(), so the healer can
                // be dead while the cast is still pending.
                if (this.state === "dead") return;
                if (t && t.state !== "dead") t.health.adjustValue(50, "magic_power", false);
                this.states.attack = "primed";
            },
            args: [target],
        });
    }

    cleanup(): void {
        this.heal_timer?.remove(false);
        this.heal_timer = null;
        super.cleanup();
    }

    getMissingHealth(enemy: Enemy): number {
        return enemy?.health.stats.max - enemy?.health.stats.value;
    }

    lastStanding(): void {
        this.aggro_radius = 400;
        this.showDebugInfo();
    }
}

export default Healer;
