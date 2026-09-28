import { Scale, type GameObjects, type Scene } from "phaser";
import { getHudInsets, safeZoneRect, watchHudInsets } from "@helpers/safeArea";

export interface SafeZone {
    zone: GameObjects.Zone;
    // Detaches the resize/inset listeners. Idempotent; call from the scene's
    // shutdown().
    release: () => void;
}

// Adds the scene's layout zone: the canvas inset by the notch/home-indicator
// safe area and then by `padding`. The HUD aligns to it. The zone is re-fitted
// whenever the canvas resizes (window change, rotation) or the safe-area
// insets change (e.g. reported late after returning from the app switcher),
// and `onLayout` then runs so the scene can re-align whatever it placed.
export function addSafeZone(scene: Scene, padding: number, onLayout: () => void): SafeZone {
    const zone = scene.add.zone(0, 0, 1, 1).setOrigin(0);

    const fit = () => {
        const rect = safeZoneRect(scene.scale.width, scene.scale.height, padding, getHudInsets());
        zone.setPosition(rect.x, rect.y).setSize(rect.width, rect.height);
    };
    const relayout = () => {
        fit();
        onLayout();
    };
    fit();

    // The ScaleManager is game-level and outlives the scene, so this listener
    // must be removed explicitly.
    scene.scale.on(Scale.Events.RESIZE, relayout);
    const unwatch = watchHudInsets(relayout);

    return {
        zone,
        release: () => {
            scene.scale.off(Scale.Events.RESIZE, relayout);
            unwatch();
        },
    };
}
