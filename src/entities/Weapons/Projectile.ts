import { GameObjects, Math as PhaserMath } from "phaser";
import type { Scene } from "phaser";

export interface ProjectileTarget {
    x: number;
    y: number;
    alive?: boolean;
}

export interface ProjectileOptions {
    scene: Scene;
    x: number;
    y: number;
    key: string;
    frame?: string | number;
    speed: number;
    target: ProjectileTarget;
    onImpact: (target: ProjectileTarget) => void;
}

// Homing projectile: re-acquires its target's position every frame and
// applies the impact callback on arrival, so damage lands when the visual
// does. If the target dies mid-flight it flies on to the last known position
// and despawns without applying anything. No external listeners or timers —
// the update-list preUpdate drives it and destroy() releases everything.
class Projectile extends GameObjects.Sprite {
    private speed: number;
    private homingTarget: ProjectileTarget;
    private onImpact: (target: ProjectileTarget) => void;
    private lastKnown: { x: number; y: number };

    constructor({ scene, x, y, key, frame, speed, target, onImpact }: ProjectileOptions) {
        super(scene, x, y, key, frame);
        this.speed = speed;
        this.homingTarget = target;
        this.onImpact = onImpact;
        this.lastKnown = { x: target.x, y: target.y };
        scene.add.existing(this);
        this.setDepth(this.y);
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        this.tick(delta);
    }

    // Homing step, separated from preUpdate so tests can drive it against a
    // constructor-free fake without booting Phaser's animation system.
    tick(delta: number): void {
        const target = this.homingTarget;
        const live = target.alive !== false;
        if (live) {
            this.lastKnown.x = target.x;
            this.lastKnown.y = target.y;
        }

        const step = this.speed * (delta / 1000);
        const distance = PhaserMath.Distance.Between(
            this.x,
            this.y,
            this.lastKnown.x,
            this.lastKnown.y
        );

        if (distance <= step) {
            if (live) this.onImpact(target);
            this.destroy();
            return;
        }

        const angle = Math.atan2(this.lastKnown.y - this.y, this.lastKnown.x - this.x);
        this.x += Math.cos(angle) * step;
        this.y += Math.sin(angle) * step;
        this.setRotation(angle);
        this.setDepth(this.y);
    }
}

export default Projectile;
