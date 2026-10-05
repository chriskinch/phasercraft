import { GameObjects, Scenes, type Scene } from "phaser";

// The red ring under the selected enemy (#533). Only one enemy is selected at
// a time, so instead of a hidden Graphics on every enemy the scene keeps one
// ring and moves it into the selected enemy's container. It is drawn with the
// per-enemy ring's commands into the same slot (bottom of the container, under
// the monster), so it renders the same.

/** The container a ring sits in: an enemy, sized to its monster. */
export type RingOwner = GameObjects.Container;

const SIZE = 5;
const rings = new WeakMap<Scene, SelectionRing>();

export default class SelectionRing {
    private graphics: GameObjects.Graphics | null = null;
    private owner: RingOwner | null = null;

    private constructor(private readonly scene: Scene) {
        scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    /** The scene's ring, made on first use. */
    static for(scene: Scene): SelectionRing {
        let ring = rings.get(scene);
        if (!ring) {
            ring = new SelectionRing(scene);
            rings.set(scene, ring);
        }
        return ring;
    }

    attach(owner: RingOwner): void {
        // A container destroys its children, so an owner that went away while
        // holding the ring took it along: draw a new one.
        if (!this.graphics?.scene) this.graphics = this.scene.make.graphics({}, false);
        const graphics = this.graphics;
        graphics.clear();
        graphics.scaleY = 0.5;
        graphics.lineStyle(4, 0xb93f3c, 0.9);
        graphics.strokeCircle(0, owner.height / 2 + SIZE, owner.width / 2 + SIZE);
        graphics.setDepth(10);
        graphics.setVisible(true);
        // Moving between containers takes it out of the last owner.
        owner.addAt(graphics, 0);
        this.owner = owner;
    }

    /** Hides the ring if `owner` holds it; it stays put until the next attach. */
    detach(owner: RingOwner): void {
        if (this.owner !== owner) return;
        this.graphics?.setVisible(false);
        this.owner = null;
    }

    cleanup(): void {
        // Idempotent: the scene emits SHUTDOWN once per run, and the ring may
        // already be gone with its last owner.
        if (this.graphics?.scene) this.graphics.destroy();
        this.graphics = null;
        this.owner = null;
        rings.delete(this.scene);
    }
}
