import { GameObjects, Scene, Physics } from "phaser";

interface HeroConfig {
    scene: Scene;
    key: string;
}

/**
 * Render scale for the player sprite. The class sheets are 24×32 cells of 16×24
 * art, which reads small against the tilesets; `pixelArt: true` means nearest
 * filtering, so an integer scale stays crisp. Player sizes its collision box
 * from the unscaled frame, so this is display only.
 */
export const HERO_SCALE = 2;

/**
 * Topmost row of the class art inside its 24×32 cell (weapon tips included),
 * as baked by scripts/build-player-sheets.ts. The pack's art is shorter than
 * the cell, so its top sits well below the frame's top edge.
 */
export const HERO_ART_TOP = 9;

class Hero extends GameObjects.Sprite {
    public body!: Physics.Arcade.Body;

    constructor(config: HeroConfig) {
        super(config.scene, 0, 0, config.key);
        this.setScale(HERO_SCALE);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.body.collideWorldBounds = true;
        this.body.immovable = true;
    }

    /** Y of the art's top edge, relative to the sprite's origin, at the current scale. */
    artTop(): number {
        return -this.displayHeight / 2 + HERO_ART_TOP * this.scaleY;
    }

    walk(anim: string): void {
        this.anims.play(anim, true);
    }

    death(): void {
        this.anims.play("player-death");
    }

    idle(): void {
        this.anims.play("player-idle", true);
    }

    root(): void {
        this.anims.play("player-idle", true);
        this.anims.stop();
    }
}

export default Hero;
