// Host side of host-authoritative co-op combat (epic #2). Attached by
// GameScene when a session is connected and this client is the HOST. The host
// runs the real simulation (enemies, waves, loot, physics) exactly as in
// single-player; this replicator:
//   - streams enemy snapshots to the guest (~10Hz),
//   - broadcasts enemy deaths (both players get full XP), loot spawns,
//     loot removal, coin credits, and wave transitions,
//   - applies the guest's damage/loot events after validating them,
//   - lets enemies target the partner's avatar (scene.coopTarget) and relays
//     their hits to the guest's client (which owns the guest's health),
//   - owns the downed/revive/game-over policy for the host's own player.

import { Scenes } from "phaser";
import { v4 as uuid } from "uuid";
import type { GameObjects, Scene } from "phaser";
import mapStateToData from "@helpers/mapStateToData";
import type Enemy from "@entities/Enemy/Enemy";
import type Player from "@entities/Player/Player";
import type CoopPresence from "./CoopPresence";
import { coopSession, type CoopSession } from "./CoopSession";
import type { CoopMessage, EnemySnapshot } from "./protocol";

/** Enemy snapshot cadence — same 10Hz as avatar presence. */
const SEND_INTERVAL_MS = 100;

/** Coin credit per pickup kind, mirroring Coin.collect / Gem.collect. */
const COIN_VALUES: Record<string, number> = { coin: 1, gem: 5 };

/** The scene surface the host replicator drives (kept narrow for tests). */
interface HostScene {
    events: Scene["events"];
    enemies: GameObjects.Group;
    player: Player;
    coopTarget?: () => GameObjects.Container | null;
}

/** The loot-drop surface shared by Coin/Gem/Crafting. */
interface LootDrop {
    x: number;
    y: number;
    emit(event: string, ...args: unknown[]): boolean;
    once(event: string | symbol, fn: (...args: never[]) => void, context?: unknown): unknown;
    destroy(): void;
}

interface TrackedLoot {
    drop: LootDrop;
    kind: string;
    /** Set before destroy when the guest collected it (crafting credit). */
    collectedByGuest: boolean;
}

interface HostReplicatorOptions {
    scene: HostScene;
    presence: CoopPresence;
    /** Called when both players are dead — the scene runs its game-over flow. */
    onGameOver: () => void;
    session?: CoopSession;
}

export default class HostReplicator {
    private readonly scene: HostScene;
    private readonly presence: CoopPresence;
    private readonly onGameOver: () => void;
    private readonly session: CoopSession;
    private loot = new Map<string, TrackedLoot>();
    private sendAccumulator = 0;
    private localDown = false;
    private peerDown = false;
    private waveDoneSent = false;
    private cleaned = false;
    private readonly unsubscribeMessage: () => void;
    private readonly unsubscribeWave: () => void;

    constructor({ scene, presence, onGameOver, session = coopSession }: HostReplicatorOptions) {
        this.scene = scene;
        this.presence = presence;
        this.onGameOver = onGameOver;
        this.session = session;

        // Enemies may target the partner's avatar while it is present & alive.
        scene.coopTarget = () => (this.peerDown ? null : this.presence.getRemotePlayer());

        // The replicator owns the death policy: detach the player's own
        // death handler (spectate is reversible; death() is not).
        scene.events.off("player:dead", scene.player.death, scene.player);
        scene.events.on("player:dead", this.onLocalPlayerDead, this);

        scene.events.on("enemy:dead", this.onEnemyDead, this);
        scene.events.on("loot:spawned", this.onLootSpawned, this);
        scene.events.on("enemy:attack:peer", this.onEnemyAttackPeer, this);
        scene.events.on("enemies:dead", this.onWaveCleared, this);
        scene.events.on(Scenes.Events.UPDATE, this.onUpdate, this);
        scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);

        this.unsubscribeMessage = this.session.onMessage(this.onMessage);
        // Fires immediately with the current wave (init:true) and on advance.
        this.unsubscribeWave = mapStateToData("wave", (wave: unknown) => {
            if (typeof wave !== "number") return;
            this.waveDoneSent = false;
            this.send({ t: "wave", n: wave });
        });
    }

    private send(message: CoopMessage): void {
        this.session.send(message);
    }

    private liveEnemies(): Enemy[] {
        return (this.scene.enemies.getChildren() as Enemy[]).filter((enemy) => enemy.alive);
    }

    private onUpdate(time: number, delta: number): void {
        if (!this.session.isConnected()) return;
        this.sendAccumulator += delta;
        if (this.sendAccumulator < SEND_INTERVAL_MS) return;
        this.sendAccumulator = 0;

        const list: EnemySnapshot[] = this.liveEnemies().map((enemy) => ({
            id: enemy.uuid,
            key: enemy.key,
            x: enemy.x,
            y: enemy.y,
            hp: enemy.health.getValue(),
            max: enemy.stats.health_max,
        }));
        this.send({ t: "enemies", list });
    }

    private onMessage = (message: CoopMessage): void => {
        if (this.cleaned) return;
        switch (message.t) {
            case "hit": {
                const enemy = this.liveEnemies().find((e) => e.uuid === message.id);
                if (enemy) enemy.hit({ power: message.power, crit: message.crit });
                break;
            }
            case "lootTake": {
                const tracked = this.loot.get(message.id);
                if (!tracked) break; // already collected/expired — guest gets lootGone
                if (COIN_VALUES[tracked.kind] !== undefined) {
                    // Coins/gems pay out to both players: the drop's normal
                    // collect() credits the host store; onLootCollected (below)
                    // sends the guest their credit.
                    tracked.drop.emit("loot:collect", tracked.drop);
                } else {
                    // Crafting materials go to the collector only.
                    tracked.collectedByGuest = true;
                    tracked.drop.destroy();
                }
                break;
            }
            case "down": {
                this.peerDown = true;
                if (this.localDown) this.endRun();
                break;
            }
        }
    };

    private onLocalPlayerDead = (): void => {
        if (this.localDown || this.cleaned) return;
        if (this.peerDown || !this.presence.hasRemotePlayer()) {
            // Partner already down (or not even in the arena) — run over.
            this.endRun();
            return;
        }
        this.localDown = true;
        this.scene.player.down();
        this.send({ t: "down" });
    };

    private endRun(): void {
        this.send({ t: "gameOver" });
        this.onGameOver();
    }

    private onEnemyDead = (enemy: Enemy): void => {
        this.send({ t: "enemyDead", id: enemy.uuid, xp: enemy.xp });
    };

    private onLootSpawned = (drop: LootDrop, kind: string): void => {
        const id = uuid();
        const tracked: TrackedLoot = { drop, kind, collectedByGuest: false };
        this.loot.set(id, tracked);

        // Fires for both host pickups and guest-initiated collects (the
        // lootTake path funnels through the same event).
        drop.once("loot:collect", () => {
            const value = COIN_VALUES[kind];
            if (value !== undefined) this.send({ t: "coins", value });
        });
        drop.once("destroy", () => {
            this.loot.delete(id);
            this.send({ t: "lootGone", id, by: tracked.collectedByGuest ? "guest" : "host" });
        });

        this.send({ t: "loot", loot: { id, kind, x: drop.x, y: drop.y } });
    };

    private onEnemyAttackPeer = (power: number): void => {
        if (!this.peerDown) this.send({ t: "peerHit", power });
    };

    private onWaveCleared = (): void => {
        // GameScene re-emits enemies:dead every empty frame between waves —
        // edge-trigger on the first one per wave (reset by the wave advance).
        if (this.waveDoneSent) return;
        this.waveDoneSent = true;
        this.send({ t: "waveDone" });
        this.peerDown = false;
        if (this.localDown) {
            this.localDown = false;
            this.scene.player.revive();
        }
    };

    cleanup(): void {
        if (this.cleaned) return;
        this.cleaned = true;
        // Leaving the arena tears the authoritative world down — clear the
        // guest's replicated enemies rather than leaving them frozen.
        this.send({ t: "enemies", list: [] });
        delete this.scene.coopTarget;
        this.scene.events.off("player:dead", this.onLocalPlayerDead, this);
        this.scene.events.off("enemy:dead", this.onEnemyDead, this);
        this.scene.events.off("loot:spawned", this.onLootSpawned, this);
        this.scene.events.off("enemy:attack:peer", this.onEnemyAttackPeer, this);
        this.scene.events.off("enemies:dead", this.onWaveCleared, this);
        this.scene.events.off(Scenes.Events.UPDATE, this.onUpdate, this);
        this.scene.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.unsubscribeMessage();
        this.unsubscribeWave();
        this.loot.clear();
    }
}
