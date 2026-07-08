import { describe, it, expect } from "vitest";
import { decodeMessage, encodeMessage, PROTOCOL_VERSION, type CoopMessage } from "./protocol";

describe("coop protocol", () => {
    it("round-trips every message type", () => {
        const messages = [
            { t: "hello", v: PROTOCOL_VERSION, character: "Warrior" },
            { t: "state", x: 123.5, y: -7, area: "town" },
            { t: "bye" },
        ] as const;
        for (const message of messages) {
            expect(decodeMessage(encodeMessage(message))).toEqual(message);
        }
    });

    it("rejects malformed frames", () => {
        expect(decodeMessage("not json")).toBeNull();
        expect(decodeMessage('"a string"')).toBeNull();
        expect(decodeMessage("null")).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "unknown" }))).toBeNull();
        expect(decodeMessage(12 as unknown as string)).toBeNull();
    });

    it("rejects a hello with a wrong version or unknown class", () => {
        expect(
            decodeMessage(
                JSON.stringify({ t: "hello", v: PROTOCOL_VERSION + 1, character: "Mage" })
            )
        ).toBeNull();
        expect(
            decodeMessage(JSON.stringify({ t: "hello", v: PROTOCOL_VERSION, character: "Paladin" }))
        ).toBeNull();
    });

    it("round-trips the host-authoritative v2 messages", () => {
        const messages: CoopMessage[] = [
            {
                t: "enemies",
                list: [{ id: "e1", key: "baby-ghoul", x: 1, y: 2, hp: 50, max: 100 }],
            },
            { t: "enemyDead", id: "e1", xp: 30 },
            { t: "loot", loot: { id: "l1", kind: "coin", x: 3, y: 4 } },
            { t: "lootGone", id: "l1", by: "guest" },
            { t: "coins", value: 5 },
            { t: "peerHit", power: 42 },
            { t: "wave", n: 3 },
            { t: "waveDone" },
            { t: "gameOver" },
            { t: "hit", id: "e1", power: 25, crit: true },
            { t: "lootTake", id: "l1" },
            { t: "down" },
        ];
        for (const message of messages) {
            expect(decodeMessage(encodeMessage(message))).toEqual(message);
        }
    });

    it("rejects malformed v2 payloads", () => {
        expect(decodeMessage(JSON.stringify({ t: "enemies", list: [{ id: 1 }] }))).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "enemyDead", id: "e1" }))).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "loot", loot: { id: "l1" } }))).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "lootGone", id: "l1", by: "x" }))).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "coins", value: -1 }))).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "peerHit", power: "9" }))).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "wave", n: 0 }))).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "hit", id: "e1" }))).toBeNull();
        expect(decodeMessage(JSON.stringify({ t: "lootTake" }))).toBeNull();
    });

    it("rejects non-finite state coordinates", () => {
        expect(
            decodeMessage(JSON.stringify({ t: "state", x: "12", y: 3, area: "town" }))
        ).toBeNull();
        expect(
            decodeMessage(JSON.stringify({ t: "state", x: 1, y: null, area: "town" }))
        ).toBeNull();
        expect(decodeMessage('{"t":"state","x":1,"y":2}')).toBeNull();
    });
});
