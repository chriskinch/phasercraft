import Enemy from "./Enemy";
import CastBar from "@entities/UI/CastBar";
import type { EnemyOptions } from "@/types/game";

// Cast time, cooldown after a heal lands (ms), and heal size as a fraction of
// the target's max health.
export const HEAL_CAST_MS = 1000;
export const HEAL_COOLDOWN_MS = 5000;
export const HEAL_FRACTION = 0.25;
// Healers only heal enemies within this many px of themselves, so the healer
// (and its cast bar) is near the heal it lands.
export const HEAL_RANGE = 240;

// Aggro radius while there is healing to do (hang back), and while there is
// none (chase and attack the player, like other enemies).
export const HEALER_AGGRO_RADIUS = 40;
export const HEALER_CHASE_RADIUS = 250;

// Enemies with a heal already being cast on them. Other healers skip them, so
// several healers can't pick the same target and land their heals together.
const claimed = new WeakSet<Enemy>();

class Healer extends Enemy {
    // The pending heal cast, removed in cleanup() so a dead healer can't land it.
    public heal_timer: Phaser.Time.TimerEvent | null = null;
    // The enemy the pending cast is on (claimed until the cast ends).
    public heal_target: Enemy | null = null;
    // Post-heal cooldown; heals wait for it, auto-attacks don't.
    public heal_cooldown: Phaser.Time.TimerEvent | null = null;
    // Aggro radius used when there is nothing to heal; raised when last standing.
    public chase_aggro_radius = HEALER_CHASE_RADIUS;
    public last_standing = false;
    // Shows the heal cast; above the health bar (-30).
    public castBar!: CastBar;

    constructor(config: EnemyOptions) {
        const defaults = {
            circling_radius: 70,
            aggro_radius: HEALER_AGGRO_RADIUS,
        };
        super({ ...defaults, ...config });

        this.castBar = new CastBar(this.scene, this, { y: -36, listen: false });
        this.once("enemy:last", this.lastStanding, this);
    }

    update(time?: number, delta?: number): void {
        super.update(time ?? 0, delta ?? 0);

        if (this.active_group.getChildren().length === 1) this.emit("enemy:last", this);

        // Damage doesn't interrupt a heal cast; a stun does.
        if (this.heal_timer && this.isStunned()) this.interruptHeal();

        // Scan once per frame (getHealTarget is pure) unless already casting:
        // the result picks both the heal and whether to hang back. Enemy.update
        // returns early on stun, so the stun check has to be repeated here.
        if (this.state === "spawned") {
            const target = this.heal_timer ? undefined : this.getHealTarget();
            if (
                target &&
                !this.isStunned() &&
                !this.heal_cooldown &&
                this.states.attack === "primed"
            ) {
                this.healTarget(target);
            }
            // Hang back while casting or ready to heal someone; with nothing to
            // heal, the heal on cooldown, or when last standing, go for the player.
            const support =
                (this.heal_timer || (target && !this.heal_cooldown)) && !this.last_standing;
            this.aggro_radius = support ? HEALER_AGGRO_RADIUS : this.chase_aggro_radius;
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

    // The enemy within HEAL_RANGE (the healer included) with the lowest health
    // fraction, among those hurt and not already being healed; ties go to the
    // first in group order. One allocation-free pass over the group's Set
    // (getChildren() copies it).
    getHealTarget(): Enemy | undefined {
        let best: Enemy | undefined;
        let bestFraction = 1;
        const rangeSq = HEAL_RANGE * HEAL_RANGE;
        for (const child of this.active_group.children) {
            const enemy = child as Enemy;
            const { value, max } = enemy.health.stats;
            const fraction = value / max;
            // Strict `<` from 1 also requires the enemy to be hurt and skips NaN.
            if (!(fraction < bestFraction) || claimed.has(enemy)) continue;
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            if (dx * dx + dy * dy <= rangeSq) {
                best = enemy;
                bestFraction = fraction;
            }
        }
        return best;
    }

    healTarget(target: Enemy | undefined = this.getHealTarget()): void {
        this.states.attack = "casting";
        if (target) {
            claimed.add(target);
            this.heal_target = target;
        }
        this.castBar.onStart({ duration: HEAL_CAST_MS / 1000 });
        this.heal_timer = this.scene.time.addEvent({
            delay: HEAL_CAST_MS,
            callback: (t: Enemy) => {
                this.heal_timer = null;
                this.releaseTarget();
                this.castBar.onStop();
                // The death animation runs before destroy(), so the healer can
                // be dead while the cast is still pending.
                if (this.state === "dead") return;
                if (t && t.state !== "dead") {
                    // Capped at missing health so the combat text shows what landed.
                    const amount = Math.min(
                        Math.ceil(t.health.stats.max * HEAL_FRACTION),
                        this.getMissingHealth(t)
                    );
                    if (amount > 0) t.health.adjustValue(amount, "heal", false);
                }
                this.states.attack = "primed";
                this.startCooldown();
            },
            args: [target],
        });
    }

    startCooldown(): void {
        this.heal_cooldown = this.scene.time.addEvent({
            delay: HEAL_COOLDOWN_MS,
            callback: () => {
                this.heal_cooldown = null;
            },
        });
    }

    // Stops the pending cast (if any): its timer, its claim on the target and
    // the cast bar. Idempotent.
    cancelCast(): void {
        this.heal_timer?.remove(false);
        this.heal_timer = null;
        this.releaseTarget();
        this.castBar?.onStop();
    }

    releaseTarget(): void {
        if (this.heal_target) claimed.delete(this.heal_target);
        this.heal_target = null;
    }

    // A stun cancels the cast without healing; the cooldown still starts.
    interruptHeal(): void {
        this.cancelCast();
        this.states.attack = "primed";
        this.startCooldown();
    }

    death(): void {
        // Drop the cast bar with the cast as the death animation starts.
        this.cancelCast();
        super.death();
    }

    cleanup(): void {
        this.cancelCast();
        this.castBar?.cleanup();
        this.heal_cooldown?.remove(false);
        this.heal_cooldown = null;
        super.cleanup();
    }

    getMissingHealth(enemy: Enemy): number {
        return enemy?.health.stats.max - enemy?.health.stats.value;
    }

    lastStanding(): void {
        this.last_standing = true;
        this.chase_aggro_radius = 400;
        this.aggro_radius = 400;
        this.showDebugInfo();
    }
}

export default Healer;
