import { GameObjects, Scene, Physics } from "phaser";

interface HeroConfig {
    scene: Scene;
    key: string;
}

/**
 * Render scale for the player sprite. The class sheets are 24×32 cells of 16×24
 * art, which reads small against the tilesets; `pixelArt: true` means nearest
 * filtering, so an integer scale stays crisp. Both physics bodies keep their
 * unscaled size: Hero's own body (what enemies collide with) is shrunk back in
 * sizeBody(), and Player's terrain box is sized from the frame and anchored at
 * the scaled sprite's feet.
 */
export const HERO_SCALE = 2;

class Hero extends GameObjects.Sprite {
    public body!: Physics.Arcade.Body;

    constructor(config: HeroConfig) {
        super(config.scene, 0, 0, config.key);
        this.setScale(HERO_SCALE);
        config.scene.physics.world.enable(this);
        this.sizeBody();
        config.scene.add.existing(this);
        this.body.collideWorldBounds = true;
        this.body.immovable = true;
    }

    /**
     * Arcade multiplies a body's source size by the sprite's scale, so halve
     * it back: the enemy collider stays the unscaled frame (24×32), centred.
     */
    sizeBody(): void {
        this.body.setSize(this.width / HERO_SCALE, this.height / HERO_SCALE, true);
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
