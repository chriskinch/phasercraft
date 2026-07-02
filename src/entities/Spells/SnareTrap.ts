import Spell from "./Spell";
import Trap from "../Weapons/Trap";
import type { SpellOptions, TargetType } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";

class SnareTrap extends Spell {
    public type: string;
    public duration: number;
    public lifespan: number;
    public item!: Trap;

    constructor(config: SpellOptions) {
        const defaults = {
            name: "snaretrap",
            icon_name: "icon_0020_shackle",
            cooldown: 0,
            cost: {
                rage: 20,
                mana: 30,
                energy: 20,
            },
            type: "bleed",
            duration: 6,
            lifespan: 20,
            targetKind: "ground" as const,
            castRange: 300,
            aoeRadius: 20,
        };

        super({ ...defaults, ...config });
        this.type = "bleed";
        this.duration = 6;
        this.lifespan = 20;
    }

    // Override and remove the default spell animation functions.
    setAnimation(): void {}
    startAnimation(): void {}

    triggerTrap(target: Enemy): void {
        target.body.setMaxVelocity(0);
        target.monster.anims.pause();
        target.body.checkCollision.none = true;
        // Using a flat value and false so trap cannot crit. TODO: Bleed over time.
        target.health.adjustValue(-20, this.type, false);

        this.scene.time.delayedCall(
            this.duration * 1000,
            () => {
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
