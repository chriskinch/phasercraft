import { describe, it, expect } from "vitest";
import { decodeMessage, encodeMessage, PROTOCOL_VERSION } from "./protocol";

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
