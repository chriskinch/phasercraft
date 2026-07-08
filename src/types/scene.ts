import type { Scene, GameObjects } from "phaser";
import type { PlayerType } from "@entities/Player/AssignClass";
import type Enemy from "@entities/Enemy/Enemy";
import type UI from "@entities/UI/HUD";

// The surface of the gameplay scene (GameScene / TownScene) that entities,
// spells, loot and the HUD read off `this.scene`. These members are not part of
// the base Phaser `Scene`, so the call sites historically cast with inline
// `this.scene as Scene & { ... }` augmentations. `GameSceneLike` replaces every
// one of those scattered casts with a single named shape (issue #308).
//
// This is intentionally a standalone interface that the entities cast to, rather
// than something the scene classes `implements`: a couple of the members below
// are consumed off the scene but are not actually declared on GameScene /
// TownScene (see the per-member notes), so `implements` would force adding
// never-written fields and misrepresent the real class. The interface models
// what the consumers genuinely read; keeping it separate documents that seam
// honestly without changing any runtime behaviour.
export interface GameSceneLike extends Scene {
    player: PlayerType;
    enemies: GameObjects.Group;
    active_enemies: GameObjects.Group;
    // Written by Enemy.select()/deselect() and read by Player; the scene does
    // not declare this field, so it is `undefined` until an enemy is selected.
    selected: Enemy | null | undefined;
    depth_group: Record<string, number>;
    zone: GameObjects.Zone;
    // Read by the HUD wave readout. Note: neither scene declares `wave` (it
    // lives in the Redux store), so at runtime this is `undefined` and the
    // initial "Wave: NaN" is immediately overwritten by the `wave` store
    // subscription. Preserved as-is; flagged for a separate fix.
    wave: number;
    UI: UI;
    global_attack_delay: number;
    // Co-op hook (epic #2): set by the host replicator while a partner's
    // avatar is present in this scene and alive, so enemies can target either
    // player. Absent/undefined outside a co-op session.
    coopTarget?: () => GameObjects.Container | null;
}
