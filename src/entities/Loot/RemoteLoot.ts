// Guest-side replicated loot drop (epic #2, host-authoritative track). The
// host owns the real Coin/Gem/Crafting entity; this is its visual twin on the
// guest. Touching it sends a collect *intent* to the host — the host validates
// (first-pickup-wins) and answers with lootGone/coins, so this entity never
// credits the store itself.

import { GameObjects, Scene, Physics } from "phaser";
import type { GameSceneLike } from "@/types/scene";

interface RemoteLootOptions {
    scene: Scene;
    id: string;
    /** "coin", "gem", or a crafting-material key. */
    kind: string;
    x: number;
    y: number;
    /** Called (at most once) when the local player touches this drop. */
    onTake: (id: string) => void;
}

class RemoteLoot extends GameObjects.Sprite {
    public readonly id: string;
    public readonly kind: string;
    public body!: Physics.Arcade.Body;
    private taken = false;
    private collider?: Physics.Arcade.Collider;
    private activateTimer?: Phaser.Time.TimerEvent;

    constructor({ scene, id, kind, x, y, onTake }: RemoteLootOptions) {
        // Mirror the real entities' textures: Coin/Gem are animated sheets,
        // crafting materials are frames on the shared "crafting" atlas.
        const [texture, frame] =
            kind === "coin"
                ? (["coin-spin", undefined] as const)
                : kind === "gem"
                  ? (["gem-shine", undefined] as const)
                  : (["crafting", kind] as const);
        super(scene, x, y, texture, frame);
        this.id = id;
        this.kind = kind;

        scene.physics.world.enable(this);
        scene.add.existing(this).setDepth((scene as GameSceneLike).depth_group.UI);
        this.body.immovable = true;
        if (kind === "coin") this.anims.play("coin");
        if (kind === "gem") {
            this.anims.play("gem");
            this.setScale(0.5);
        }

        // Same 500ms arming delay as the real drops, so a spawn burst doesn't
        // instantly vacuum into a player standing on the corpse.
        this.activateTimer = scene.time.delayedCall(
            500,
            () => {
                this.collider = scene.physics.add.collider(
                    (scene as GameSceneLike).player,
                    this,
                    () => {
                        if (this.taken) return;
                        this.taken = true;
                        onTake(this.id);
                    },
                    undefined,
                    this
                );
            },
            [],
            this
        );

        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    /** Host confirmed the drop is gone — play the collect tween and go away. */
    resolve(): void {
        this.scene.tweens.add({
            targets: this,
            y: { value: this.y - 25, duration: 750, ease: "Cubic.easeOut" },
            alpha: { value: 0, duration: 750, ease: "Cubic.easeOut" },
            onComplete: () => this.destroy(),
        });
    }

    cleanup(): void {
        if (this.activateTimer) this.activateTimer.remove();
        if (this.collider) this.scene.physics.world.removeCollider(this.collider);
    }
}

export default RemoteLoot;
