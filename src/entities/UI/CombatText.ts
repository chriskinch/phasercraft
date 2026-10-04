import { GameObjects, Scene, Physics } from "phaser";
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
    public body!: Physics.Arcade.Body;

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

        this.scene.physics.world.enable(this);

        const rand_plus_minus = (Math.random() - 0.5) * wander;
        this.body.setVelocity(120 * rand_plus_minus, -speed).setGravityY(gravity);
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

    getRandomVelocity(): number {
        let min = 50;
        let max = 100;
        let v = min + Math.random() * (max - min);
        let absV = Math.random() >= 0.5 ? -v : v;
        return absV;
    }
}

export default CombatText;
