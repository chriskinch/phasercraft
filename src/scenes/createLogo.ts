import { GameObjects, Scene } from "phaser";
import { FONTS, pixelFontSize } from "@config/fonts";

/**
 * Options for {@link createLogo}.
 */
export interface LogoOptions {
    /** Centre X of the logo in scene coordinates. */
    x: number;
    /** Centre Y of the logo in scene coordinates. */
    y: number;
    /** Overall scale multiplier applied to the whole logo. Defaults to 1. */
    scale?: number;
    /**
     * Texture key of the character sprite to pair with the wordmark. Must be a
     * spritesheet already present in the texture manager. Defaults to "warrior".
     */
    characterKey?: string;
}

const WORDMARK = "PHASERCRAFT";
// Screen pixels per font pixel; the drop shadow is one font pixel deep.
const LOGO_SCALE = 6;

/**
 * Builds the (placeholder) Phasercraft logo: a "PHASERCRAFT" wordmark with a
 * thick black bold outline plus an offset duplicate behind it for a pixel
 * 3D/drop-shadow effect, paired with a character sprite beneath it.
 *
 * Rendered as one {@link GameObjects.BitmapText} in the black-outlined pixel
 * font (registered by BootScene), tinted gold, with its drop shadow as the
 * offset duplicate.
 * Everything is grouped in a single {@link GameObjects.Container} so callers can
 * position, scale, or destroy the whole logo in one call.
 */
export default function createLogo(scene: Scene, options: LogoOptions): GameObjects.Container {
    const { x, y, scale = 1, characterKey = "warrior" } = options;

    const container = scene.add.container(x, y);

    // Gold fill (tint) inside the font's black outline; the drop shadow is the
    // offset dark duplicate behind it, the pixel 3D lift.
    const wordmark = scene.add
        .bitmapText(0, 0, FONTS.outline, WORDMARK, pixelFontSize(LOGO_SCALE))
        .setOrigin(0.5)
        .setTint(0xf4c542)
        .setDropShadow(LOGO_SCALE, LOGO_SCALE, 0x101010, 1);

    container.add(wordmark);

    // Character sprite tucked beneath the wordmark (static idle frame), its
    // top a font pixel below the shadow.
    if (scene.textures.exists(characterKey)) {
        const sprite = scene.add.sprite(0, 0, characterKey, 0);
        sprite.setScale(4);
        sprite.setY(wordmark.height / 2 + LOGO_SCALE * 2 + sprite.displayHeight / 2);
        sprite.setOrigin(0.5);
        container.add(sprite);
    }

    container.setScale(scale);

    return container;
}
