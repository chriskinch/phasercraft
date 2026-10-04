import { GameObjects, Scene, Physics, Time } from "phaser";
import store from "@store";
import { playSfx } from "@services/sfx";
import { addScroll } from "@store/gameReducer";
import getRandomVelocity from "@helpers/getRandomVelocity";
import { SCROLL_SCALE, scrollFrameKey } from "@helpers/scrollSprites";
import { SCROLL_DROP_LEVEL, rollScrollSpell } from "@/lib/scrollDrops";
import type { SpellLevel, SpellType } from "@/types/game";
import type { GameSceneLike } from "@/types/scene";

// Phaser texture key for the scroll atlas (loaded in LoadScene).
export const SCROLL_TEXTURE = "scrolls";

interface ScrollConfig {
    scene: Scene;
    x: number;
    y: number;
    // Which spell's scroll dropped; defaults to a roll of the scroll loot table.
    spell?: SpellType;
    level?: SpellLevel;
}

// A spell scroll (#385) dropped in the world. Collected by walking over it,
// like a special; picking it up adds one unread scroll to the save.
class Scroll extends GameObjects.Sprite {
    public body!: Physics.Arcade.Body;
    public activateTimer?: Time.TimerEvent;
    public collider?: Physics.Arcade.Collider;
    public spell: SpellType;
    public level: SpellLevel;

    constructor(config: ScrollConfig) {
        const spell = config.spell ?? rollScrollSpell();
        const level = config.level ?? SCROLL_DROP_LEVEL;
        super(config.scene, config.x, config.y, SCROLL_TEXTURE, scrollFrameKey(spell, level));
        this.spell = spell;
        this.level = level;
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this).setDepth((this.scene as GameSceneLike).depth_group.UI);

        // Atlas frames are the 15 × 15 art drawn at 3×; shown at its native size.
        this.setScale(1 / SCROLL_SCALE);
        this.body.setVelocity(getRandomVelocity(25, 50), getRandomVelocity(25, 50)).setDrag(100);
        this.body.immovable = true;

        this.activateTimer = this.scene.time.delayedCall(500, this.activate, [], this);
        this.once("loot:collect", this.collect, this);

        // Lifecycle: the activate timer and the player collider outlive a plain
        // destroy (the scroll's own "loot:collect" listener goes with it), so
        // release both when it is destroyed (collected, or on shutdown).
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    activate(): void {
        this.collider = this.scene.physics.add.collider(
            (this.scene as GameSceneLike).player,
            this,
            this.touch,
            undefined,
            this
        );
    }

    cleanup(): void {
        if (this.activateTimer) this.activateTimer.remove();
        if (this.collider) this.scene.physics.world.removeCollider(this.collider);
    }

    touch(): void {
        this.emit("loot:collect", this);
    }

    collect(): void {
        store.dispatch(addScroll(this.spell, this.level));
        playSfx("coin");
        this.scene.tweens.add({
            targets: this,
            y: {
                value: this.y - 25,
                duration: 750,
                ease: "Cubic.easeOut",
            },
            alpha: {
                value: 0,
                duration: 750,
                ease: "Cubic.easeOut",
            },
            onComplete: () => this.destroy(),
        });
    }
}

export default Scroll;
