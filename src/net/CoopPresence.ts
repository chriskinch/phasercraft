// Scene-side glue for co-op presence (epic #2). A scene that can host a
// co-op partner attaches one of these next to its local player; it then:
//   - streams the local player's position to the peer (~10Hz),
//   - spawns/despawns a RemotePlayer from the peer's snapshots,
//   - hides the peer when they are in a different area (town vs dungeon).
// It is safe to attach unconditionally: with no active session it does
// nothing until the session connects (e.g. hosting from the town menu).

import { Scenes } from "phaser";
import type { Scene } from "phaser";
import RemotePlayer from "@entities/Player/RemotePlayer";
import { coopSession, type CoopSession } from "./CoopSession";
import type { CoopMessage } from "./protocol";

/** Snapshot cadence. 10Hz is plenty for lerped avatars at these move speeds. */
const SEND_INTERVAL_MS = 100;

/** The scene surface CoopPresence needs (kept narrow for tests). */
interface PresenceScene {
    events: Scene["events"];
}

/** The local avatar surface CoopPresence reads. */
interface LocalPlayerLike {
    x: number;
    y: number;
}

export default class CoopPresence {
    private remote: RemotePlayer | null = null;
    private sendAccumulator = 0;
    private cleaned = false;
    private readonly unsubscribeMessage: () => void;
    private readonly unsubscribeState: () => void;

    constructor(
        private scene: PresenceScene,
        private player: LocalPlayerLike,
        /** Which world this scene shows — matches the protocol's state.area. */
        private area: string,
        private session: CoopSession = coopSession
    ) {
        this.unsubscribeMessage = session.onMessage(this.onMessage);
        this.unsubscribeState = session.subscribe(this.onSessionState);
        scene.events.on(Scenes.Events.UPDATE, this.onUpdate, this);
        // Both cleanup paths can fire (manual scene.shutdown() plus the
        // SHUTDOWN event) — cleanup() is idempotent per the lifecycle rules.
        scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    /** True when a partner avatar is currently shown in this scene. */
    hasRemotePlayer(): boolean {
        return this.remote !== null;
    }

    private onMessage = (message: CoopMessage): void => {
        if (this.cleaned || message.t !== "state") return;

        if (message.area !== this.area) {
            // Partner is in a different world (e.g. still in town) — despawn
            // until our areas line up again.
            this.despawnRemote();
            return;
        }

        if (!this.remote) {
            this.remote = new RemotePlayer({
                scene: this.scene as Scene,
                x: message.x,
                y: message.y,
                // hello always precedes state on the reliable-ordered channel;
                // the fallback only guards a malformed peer.
                character: this.session.getState().peerCharacter ?? "Warrior",
            });
        }
        this.remote.setTargetPosition(message.x, message.y);
    };

    private onSessionState = (): void => {
        if (!this.cleaned && !this.session.isConnected()) this.despawnRemote();
    };

    private onUpdate(time: number, delta: number): void {
        this.remote?.update(time, delta);

        if (!this.session.isConnected()) return;
        this.sendAccumulator += delta;
        if (this.sendAccumulator < SEND_INTERVAL_MS) return;
        this.sendAccumulator = 0;
        this.session.send({ t: "state", x: this.player.x, y: this.player.y, area: this.area });
    }

    private despawnRemote(): void {
        this.remote?.destroy();
        this.remote = null;
    }

    cleanup(): void {
        if (this.cleaned) return;
        this.cleaned = true;
        this.scene.events.off(Scenes.Events.UPDATE, this.onUpdate, this);
        this.scene.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.unsubscribeMessage();
        this.unsubscribeState();
        this.despawnRemote();
    }
}
