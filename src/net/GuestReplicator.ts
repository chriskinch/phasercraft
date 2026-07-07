// Guest side of host-authoritative co-op combat (epic #2). Attached by
// GameScene when a session is connected and this client is the GUEST. The
// guest runs NO simulation of its own — no wave spawning, no enemy AI, no
// loot tables. This replicator:
//   - reconciles RemoteEnemy entities from the host's snapshots (they join
//     scene.enemies/active_enemies so the player's targeting/spell seams work),
//   - plays enemy deaths and awards the shared XP via the existing
//     "enemy:dead" scene event,
//   - mirrors loot drops as RemoteLoot and forwards pickup intents,
//   - applies coin credits and crafting grants confirmed by the host,
//   - applies relayed enemy hits to the local player (who owns their health),
//   - syncs the wave readout, and owns the downed/revive policy for the
//     guest's own player (the host decides game over).

import { Scenes } from "phaser";
import type { GameObjects, Scene } from "phaser";
import store from "@store";
import { addCoins, addCrafting, setWave } from "@store/gameReducer";
import RemoteEnemy from "@entities/Enemy/RemoteEnemy";
import RemoteLoot from "@entities/Loot/RemoteLoot";
import type Player from "@entities/Player/Player";
import { coopSession, type CoopSession } from "./CoopSession";
import type { CoopMessage, EnemySnapshot } from "./protocol";

/** The scene surface the guest replicator drives (kept narrow for tests). */
interface GuestScene {
    events: Scene["events"];
    enemies: GameObjects.Group;
    active_enemies: GameObjects.Group;
    player: Player;
}

interface GuestReplicatorOptions {
    scene: GuestScene;
    /** Called when the host declares the run over (both players dead). */
    onGameOver: () => void;
    /** Called when the session drops mid-arena (host left / connection lost). */
    onSessionLost: () => void;
    session?: CoopSession;
}

export default class GuestReplicator {
    private readonly scene: GuestScene;
    private readonly onGameOver: () => void;
    private readonly onSessionLost: () => void;
    private readonly session: CoopSession;
    private enemies = new Map<string, RemoteEnemy>();
    private loot = new Map<string, RemoteLoot>();
    private localDown = false;
    private cleaned = false;
    private readonly unsubscribeMessage: () => void;
    private readonly unsubscribeState: () => void;

    constructor({
        scene,
        onGameOver,
        onSessionLost,
        session = coopSession,
    }: GuestReplicatorOptions) {
        this.scene = scene;
        this.onGameOver = onGameOver;
        this.onSessionLost = onSessionLost;
        this.session = session;

        // The replicator owns the death policy: detach the player's own
        // death handler (spectate is reversible; death() is not).
        scene.events.off("player:dead", scene.player.death, scene.player);
        scene.events.on("player:dead", this.onLocalPlayerDead, this);

        scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.unsubscribeMessage = this.session.onMessage(this.onMessage);
        this.unsubscribeState = this.session.subscribe(this.onSessionState);
    }

    private onMessage = (message: CoopMessage): void => {
        if (this.cleaned) return;
        switch (message.t) {
            case "enemies":
                this.reconcileEnemies(message.list);
                break;
            case "enemyDead": {
                const remote = this.enemies.get(message.id);
                this.enemies.delete(message.id);
                if (remote) {
                    remote.die(message.xp);
                    // The existing player path (targetDead) awards the XP and
                    // clears its auto-attack when the target drops.
                    this.scene.events.emit("enemy:dead", remote);
                }
                break;
            }
            case "loot": {
                const { id, kind, x, y } = message.loot;
                this.loot.set(
                    id,
                    new RemoteLoot({
                        scene: this.scene as unknown as Scene,
                        id,
                        kind,
                        x,
                        y,
                        onTake: (lootId) => this.session.send({ t: "lootTake", id: lootId }),
                    })
                );
                break;
            }
            case "lootGone": {
                const drop = this.loot.get(message.id);
                this.loot.delete(message.id);
                if (!drop) break;
                // Crafting materials are exclusive to their collector (coins
                // arrive separately via the shared `coins` credit).
                if (message.by === "guest" && drop.kind !== "coin" && drop.kind !== "gem") {
                    store.dispatch(addCrafting(drop.kind));
                }
                drop.resolve();
                break;
            }
            case "coins":
                store.dispatch(addCoins(message.value));
                break;
            case "peerHit":
                // An enemy reached our avatar on the host's simulation; apply
                // it through the same scene event a local enemy would use, so
                // defence/shield handling stays in Player.hit.
                if (!this.localDown) this.scene.events.emit("enemy:attack", message.power);
                break;
            case "wave":
                store.dispatch(setWave(message.n));
                break;
            case "waveDone":
                if (this.localDown) {
                    this.localDown = false;
                    this.scene.player.revive();
                }
                break;
            case "gameOver":
                this.onGameOver();
                break;
        }
    };

    private onSessionState = (): void => {
        if (this.cleaned || this.session.isConnected()) return;
        // The world we were rendering lived on the host — without them there
        // is nothing to fight. Clear the replicas and bail out to town.
        const lost = this.onSessionLost;
        this.cleanup();
        lost();
    };

    private onLocalPlayerDead = (): void => {
        if (this.localDown || this.cleaned) return;
        this.localDown = true;
        this.scene.player.down();
        // The host decides whether this ends the run (both down → gameOver).
        this.session.send({ t: "down" });
    };

    private reconcileEnemies(list: EnemySnapshot[]): void {
        const seen = new Set<string>();
        for (const snapshot of list) {
            seen.add(snapshot.id);
            const existing = this.enemies.get(snapshot.id);
            if (existing) {
                existing.applySnapshot(snapshot.x, snapshot.y, snapshot.hp);
                continue;
            }
            const remote = new RemoteEnemy({
                scene: this.scene as unknown as Scene,
                id: snapshot.id,
                key: snapshot.key,
                x: snapshot.x,
                y: snapshot.y,
                maxHealth: snapshot.max,
                onHit: (id, power, crit) => this.session.send({ t: "hit", id, power, crit }),
            });
            this.enemies.set(snapshot.id, remote);
            // Group membership is what makes the player's auto-attack and
            // spell range scans see replicated enemies (runChildUpdate drives
            // their interpolation).
            this.scene.enemies.add(remote as unknown as GameObjects.GameObject);
            this.scene.active_enemies.add(remote as unknown as GameObjects.GameObject);
        }
        // An id the host no longer reports and that never got an enemyDead
        // (e.g. cleared on the host's shutdown) is silently removed.
        for (const [id, remote] of this.enemies) {
            if (!seen.has(id)) {
                this.enemies.delete(id);
                remote.destroy();
            }
        }
    }

    cleanup(): void {
        if (this.cleaned) return;
        this.cleaned = true;
        this.scene.events.off("player:dead", this.onLocalPlayerDead, this);
        this.scene.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.unsubscribeMessage();
        this.unsubscribeState();
        for (const remote of this.enemies.values()) remote.destroy();
        this.enemies.clear();
        for (const drop of this.loot.values()) drop.destroy();
        this.loot.clear();
    }
}
