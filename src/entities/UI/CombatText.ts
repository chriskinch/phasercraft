import { GameObjects, Scene, Physics } from "phaser";

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

class CombatText extends GameObjects.Text {
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
        const color: Record<string, string> = {
            physical: "#fff",
            magic: "#ef0",
            burn: "#fa0",
            bleed: "#f33",
            poison: "#5c5",
            heal: "#7c6",
            health: "#9c6",
            level: "#8f0",
        };

        // Phaser's Text constructor types `text` as string | string[]; numeric
        // values were passed in the original JS and rely on Phaser's internal
        // toString — preserve that by passing the value through unchanged.
        super(scene, x, y - 25, value as unknown as string, {
            fontFamily: "VT323",
            fontSize: crit ? "21px" : "16px",
            stroke: crit ? "#800" : "#000",
            color: type ? color[type] : "#fff",
            strokeThickness: 5,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: "#000",
                blur: 1,
                stroke: true,
                fill: false,
            },
        });

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
