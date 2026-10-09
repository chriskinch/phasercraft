import Spell from "./Spell";
import Trap from "../Weapons/Trap";
import { spellDefDefaults } from "@/types/game";
import { levelFactor } from "@/lib/levelScaling";
import type { SpellOptions, TargetType } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";

export const SNARE_TRAP_DAMAGE = 20;

class SnareTrap extends Spell {
    public type: string;
    public duration: number;
    public lifespan: number;
    public item!: Trap;
    // Trap hit damage (flat, can't crit). TODO: Bleed over time.
    public trapDamage = SNARE_TRAP_DAMAGE;
    // L1 values; applyLevel() derives the scaled fields from them.
    private base!: { duration: number; lifespan: number };

    constructor(config: SpellOptions) {
        const defaults = {
            name: "snaretrap",
            ...spellDefDefaults("SnareTrap"),
            type: "bleed",
            duration: 6,
            lifespan: 20,
            aoeRadius: 20,
        };

        super({ ...defaults, ...config });
        this.type = "bleed";
        this.duration = 6;
        this.lifespan = 20;
        this.base = { duration: this.duration, lifespan: this.lifespan };
        this.applyLevel();
    }

    applyLevel(): void {
        this.duration = this.base.duration * levelFactor(this.spellType, "duration", this.level);
        this.lifespan = this.base.lifespan * levelFactor(this.spellType, "lifespan", this.level);
        this.trapDamage = SNARE_TRAP_DAMAGE * levelFactor(this.spellType, "damage", this.level);
    }

    // Override and remove the default spell animation functions.
    setAnimation(): void {}
    startAnimation(): void {}

    triggerTrap(target: Enemy): void {
        target.body.setMaxVelocity(0);
        target.monster.anims.pause();
        target.body.checkCollision.none = true;
        // Using a flat value and false so trap cannot crit.
        target.health.adjustValue(-this.trapDamage, this.type, false);

        this.scene.time.delayedCall(
            this.duration * 1000,
            () => {
                // A despawned enemy is destroyed (no body) before this fires.
                if (!target.body) return;
                target.body.setMaxVelocity(10000);
                target.monster.anims.resume();
                target.body.checkCollision.none = false;
            },
            [],
            this
        );
    }

    layTrap(point?: { x: number; y: number }): void {
        // The CastingController passes the committed placement point; fall
        // back to the pointer for safety.
        const { x, y } = point ?? this.scene.input.activePointer;
        this.item = new Trap(this.scene, x, y, this.lifespan);
        this.item.once("trap:collide", this.effect, this);
    }

    // Invoked from two callers: castSpell passes the placement point (no
    // body, so a trap is laid) and `trap:collide` passes the colliding Enemy
    // (triggered). Kept base-compatible (`TargetType`); the body check
    // distinguishes them.
    effect(target?: TargetType): void {
        // Only trigger if the target have a body.
        // A placement point does not, so lay the trap rather than trigger it.
        target && "body" in target && target.body
            ? this.triggerTrap(target as Enemy)
            : this.layTrap(target as { x: number; y: number } | undefined);
    }
}

export default SnareTrap;
