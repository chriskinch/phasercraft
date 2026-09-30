import { GameObjects, Scenes } from "phaser";
import type { Physics } from "phaser";

interface DropInOptions {
    gravity?: number;
    bounce?: number;
    immovable?: boolean;
}

// The item dropped in is a physics-enabled Sprite that also tracks whether it
// has settled (`spawned`). Typed structurally so the helper stays decoupled
// from any specific entity (currently only Trap uses it).
type DropInItem = GameObjects.Sprite & {
    body: Physics.Arcade.Body;
    spawned?: boolean;
};

export function dropIn(
    name: string,
    item: DropInItem,
    offset: number,
    { gravity = 200, bounce = 0.3, immovable = true }: DropInOptions
): void {
    item.body.setFriction(0, 0).setDrag(0).setGravityY(gravity).setBounce(bounce);

    const scene = item.scene;
    const spawn_stop = scene.physics.add.staticImage(item.x, offset, "blank-gif");
    const collider = scene.physics.add.collider(spawn_stop, item);

    // Captured: destroy() clears item.scene, and the listener must still be
    // released from the (reused) scene emitter afterwards.
    const events = scene.events;
    let released = false;

    const release = () => {
        if (released) return;
        released = true;
        events.off("update", updateHandler);
        events.off(Scenes.Events.SHUTDOWN, release);
        item.off(GameObjects.Events.DESTROY, release);
        scene.physics.world.removeCollider(collider);
        spawn_stop.destroy();
    };

    const updateHandler = () => {
        // off() does not stop an emit already in progress: an item destroyed
        // earlier in the same "update" (e.g. by its lifespan timer, which the
        // scene clock fires from an earlier listener) is still called here.
        if (released) return;
        if (item.body.touching.down && item.body.wasTouching.down) {
            item.body.immovable = immovable;
            item.body.setVelocity(0);
            item.body.setGravityY(0);
            item.spawned = true;
            release();
            item.emit(`${name}:spawned`);
        }
    };

    events.on("update", updateHandler);
    // An item destroyed (or a scene shut down) before it settles would leave
    // the listener reading a destroyed body on the next update.
    events.once(Scenes.Events.SHUTDOWN, release);
    item.once(GameObjects.Events.DESTROY, release);
}
