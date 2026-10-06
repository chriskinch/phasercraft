import { Display, type GameObjects, type Scene } from "phaser";
import { FONTS, pixelFontSize } from "@config/fonts";
import type { MinibossDebugView } from "./SpawnDirector";

// Debug readout of the miniboss odds (#594): pinned to the top-right of the
// layout zone, it shows the chance the next new exploration cell brings on the
// miniboss and the cells counted towards the guaranteed one. Only built when
// Debug mode and its toggle are both on, so it costs nothing otherwise.

// Where it reads the director's state from, each frame.
export interface MinibossReadoutSource {
    minibossDebugView(): MinibossDebugView;
}

// Above the HUD, which sits at the scene's UI depth.
const DEPTH = 10000;

/** The readout's text: "MINIBOSS UP", or the next cell's chance and the count. */
export function minibossReadoutText(view: MinibossDebugView): string {
    if (view.active) return "MINIBOSS UP";
    const percent = Math.round(view.chance * 1000) / 10;
    return `Miniboss ${percent}% - ${view.cellsExplored}/${view.cellsToCertain} cells`;
}

export default class MinibossChanceReadout {
    private label: GameObjects.BitmapText | null;

    constructor(
        scene: Scene,
        private readonly source: MinibossReadoutSource
    ) {
        this.label = scene.add
            .bitmapText(0, 0, FONTS.outline, "", pixelFontSize(2))
            .setTint(0xffe600)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(DEPTH);
    }

    /** Pins the readout to the zone's top-right corner; re-run on resize. */
    layout(zone: GameObjects.Zone): void {
        this.label?.setPosition(Display.Bounds.GetRight(zone), Display.Bounds.GetTop(zone));
    }

    /** Refreshes the text. Called once a frame by the scene. */
    draw(): void {
        if (!this.label) return;
        const text = minibossReadoutText(this.source.minibossDebugView());
        if (this.label.text !== text) this.label.setText(text);
    }

    /** Destroys the text. Idempotent. */
    cleanup(): void {
        this.label?.destroy();
        this.label = null;
    }
}
