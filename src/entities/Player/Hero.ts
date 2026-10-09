import { GameObjects, Scene, Physics } from "phaser";

interface HeroConfig {
    scene: Scene;
    key: string;
}

/**
 * Render scale for the player sprite. The class sheets are 24×32 cells of 16×24
 * art, which reads small against the tilesets; `pixelArt: true` means nearest
 * filtering, so an integer scale stays crisp. Both physics bodies keep their
 * unscaled size and sit at the scaled sprite's feet: Hero's own body (what
 * enemies collide with) in sizeBody(), Player's terrain box in setCollisionBox().
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
     * Arcade multiplies a body's source size and offset by the sprite's scale,
     * so both are in unscaled frame pixels here. The enemy collider stays the
     * 24×32 it was before the sprite was scaled up, centred horizontally, with
     * its bottom on the scaled sprite's feet (level with Player's terrain box).
     */
    sizeBody(): void {
        const width = this.width / HERO_SCALE;
        const height = this.height / HERO_SCALE;
        this.body.setSize(width, height, false);
        this.body.setOffset((this.width - width) / 2, this.height - height);
    }

    /** Top of the enemy collider, relative to the sprite's origin: one unscaled frame above the feet. */
    colliderTop(): number {
        return this.displayHeight / 2 - this.height;
    }

    /** Centre of the enemy collider, relative to the sprite's origin: the body's visual centre. */
    centreY(): number {
        return this.colliderTop() + this.height / 2;
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
