import { GameObjects, Types, Scene } from "phaser";

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

// A chunky monospace reads as "pixel-ish" without shipping a webfont, and keeps
// this placeholder trivial to swap for real art later.
const FONT_FAMILY = '"Courier New", "Courier", monospace';

/**
 * Builds the (placeholder) Phasercraft logo: a "PHASERCRAFT" wordmark with a
 * thick black bold outline plus an offset duplicate behind it for a pixel
 * 3D/drop-shadow effect, paired with a character sprite beneath it.
 *
 * Rendered with layered {@link GameObjects.Text} rather than the preloaded
 * `wayne-3d` retro font: bitmap/retro fonts can't take a stroke or shadow, so
 * styled Text is the cleaner fit for the requested black outline + pixel shadow.
 * Everything is grouped in a single {@link GameObjects.Container} so callers can
 * position, scale, or destroy the whole logo in one call.
 */
export default function createLogo(scene: Scene, options: LogoOptions): GameObjects.Container {
    const { x, y, scale = 1, characterKey = "warrior" } = options;

    const container = scene.add.container(x, y);

    const baseStyle: Types.GameObjects.Text.TextStyle = {
        fontFamily: FONT_FAMILY,
        fontSize: "64px",
        fontStyle: "bold",
        color: "#f4c542",
    };

    // Offset duplicate behind the wordmark: this is the pixel shadow / 3D lift.
    const shadow = scene.add.text(6, 6, WORDMARK, { ...baseStyle, color: "#101010" });
    shadow.setOrigin(0.5);
    shadow.setStroke("#000000", 8);
    // Higher resolution keeps the stroked edges crisp; pixelArt on the game
    // config already disables texture smoothing so it still reads as pixelly.
    shadow.setResolution(3);

    // Main wordmark on top with a thick black bold outline.
    const wordmark = scene.add.text(0, 0, WORDMARK, baseStyle);
    wordmark.setOrigin(0.5);
    wordmark.setStroke("#000000", 8);
    wordmark.setResolution(3);

    container.add([shadow, wordmark]);

    // Character sprite tucked beneath the wordmark (static idle frame).
    if (scene.textures.exists(characterKey)) {
        const sprite = scene.add.sprite(0, wordmark.height / 2 + 56, characterKey, 0);
        sprite.setOrigin(0.5);
        sprite.setScale(4);
        container.add(sprite);
    }

    container.setScale(scale);

    return container;
}
