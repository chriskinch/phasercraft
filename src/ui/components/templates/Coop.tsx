import React, { useState, useSyncExternalStore } from "react";
import { useSelector } from "react-redux";
import Button from "@components/Button";
import { coopSession, type CoopSession } from "@/net/CoopSession";
import type { RootState } from "@store";
import styles from "./Coop.module.css";

// Online co-op panel (epic #2 POC). Host a session and read the join code to
// a friend, or enter theirs. Session state lives in the CoopSession service
// (never Redux — the store is snapshotted into save games), so this
// subscribes via useSyncExternalStore.

interface CoopProps {
    /** Injectable for tests; the app always uses the shared session. */
    session?: CoopSession;
}

const Coop: React.FC<CoopProps> = ({ session = coopSession }) => {
    const state = useSyncExternalStore(session.subscribe, session.getState);
    const character = useSelector((s: RootState) => s.game.character);
    const [codeInput, setCodeInput] = useState("");

    if (!character) {
        return (
            <div className={styles.panel}>
                <p className={styles.hint}>Load or start a game before playing co-op.</p>
            </div>
        );
    }

    const profile = { character };

    switch (state.status) {
        case "hosting":
            return (
                <div className={styles.panel}>
                    {state.code ? (
                        <>
                            <p className={styles.hint}>Share this code with your co-op partner:</p>
                            <div className={styles.code} data-testid="join-code">
                                {state.code}
                            </div>
                            <p className={styles.hint}>
                                Waiting for them to join… keep this game open.
                            </p>
                        </>
                    ) : (
                        <p className={styles.hint}>Creating session…</p>
                    )}
                    <Button text="Cancel" onClick={() => session.disconnect()} />
                </div>
            );

        case "connecting":
            return (
                <div className={styles.panel}>
                    <p className={styles.hint}>Connecting to {state.code}…</p>
                    <Button text="Cancel" onClick={() => session.disconnect()} />
                </div>
            );

        case "connected":
            return (
                <div className={styles.panel}>
                    <p className={styles.hint}>
                        Connected!{" "}
                        {state.peerCharacter
                            ? `Playing with a ${state.peerCharacter}.`
                            : "Waiting for your partner's details…"}
                    </p>
                    <p className={styles.hint}>
                        You&apos;ll see each other in town and fight the same waves in the arena —
                        the host runs the world, so the host should enter the dungeon first. Kills
                        pay XP and coins to you both; if one of you falls, you&apos;re back on your
                        feet when the wave is cleared.
                    </p>
                    <Button text="Disconnect" onClick={() => session.disconnect()} />
                </div>
            );

        case "idle":
        case "error":
            return (
                <div className={styles.panel}>
                    {state.status === "error" && state.error && (
                        <p className={styles.error} role="alert">
                            {state.error}
                        </p>
                    )}
                    <Button text="Host Game" onClick={() => void session.host(profile)} />
                    <p className={styles.divider}>— or join a friend —</p>
                    <div className={styles.joinRow}>
                        <input
                            className={styles.codeInput}
                            aria-label="Join code"
                            placeholder="CODE"
                            maxLength={5}
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                        />
                        <Button
                            text="Join"
                            disabled={codeInput.trim().length !== 5}
                            onClick={() => void session.join(codeInput, profile)}
                        />
                    </div>
                </div>
            );
    }
};

export default Coop;
