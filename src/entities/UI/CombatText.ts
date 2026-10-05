import { GameObjects, Scene, Physics, Scenes } from "phaser";
import { combatFont, pixelFontSize } from "@config/fonts";

interface CombatTextConfig {
    x: number;
    y: number;
    value: string | number;
    // Combat type that produced the text; selects the fill colour and falls
    // back to white when unset or unrecognised (callers pass a free-form
    // string, e.g. Health.adjustValue's `type`).
    type?: string;
    crit?: boolean;
    wander?: number;
    length?: number;
    speed?: number;
    gravity?: number;
}

class CombatText extends GameObjects.BitmapText {
    // The arc an Arcade body used to fly (#534), stepped on the world's own
    // fixed steps so it pauses with physics and keeps its timing, without a
    // body in the Arcade step and collision tree for every hit.
    public velocity = { x: 0, y: 0 };
    private gravity = 0;
    private world?: Physics.Arcade.World;

    constructor(
        scene: Scene,
        {
            x,
            y,
            value,
            type,
            crit,
            wander = 1,
            length = 500,
            speed = 60,
            gravity = 200,
        }: CombatTextConfig
    ) {
        // Bitmap text (#534): no canvas or texture upload per hit. Crits are
        // larger with a baked dark-red outline; the rest tint a black-outlined
        // white font by combat type.
        const { font, tint } = combatFont(type, crit);
        super(scene, x, y - 25, font, String(value), pixelFontSize(crit ? 3 : 2));
        this.setTint(tint);

        const rand_plus_minus = (Math.random() - 0.5) * wander;
        this.velocity = { x: 120 * rand_plus_minus, y: -speed };
        this.gravity = gravity;
        this.world = this.scene.physics.world;
        this.world.on(Physics.Arcade.Events.WORLD_STEP, this.step, this);
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
        this.scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.setOrigin(0.5);

        this.scene.add.existing(this);

        this.scene.add.tween({
            targets: this,
            ease: "Sine.easeInOut",
            duration: length,
            delay: 250,
            alpha: {
                from: 1,
                to: 0,
            },
            onComplete: () => this.destroy(),
        });
    }

    /**
     * One Arcade step, as Body.update integrates it (semi-implicit Euler):
     * gravity into velocity, then velocity into position. `delta` is seconds.
     */
    step(delta: number): void {
        this.velocity.y += this.gravity * delta;
        this.x += this.velocity.x * delta;
        this.y += this.velocity.y * delta;
    }

    /** Idempotent: runs on destroy and on scene shutdown. */
    cleanup(): void {
        this.world?.off(Physics.Arcade.Events.WORLD_STEP, this.step, this);
        this.world = undefined;
        this.scene?.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    getRandomVelocity(): number {
        let min = 50;
        let max = 100;
        let v = min + Math.random() * (max - min);
        let absV = Math.random() >= 0.5 ? -v : v;
        return absV;
    }
}

export default CombatText;
