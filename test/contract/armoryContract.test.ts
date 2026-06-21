import { describe, it, expect } from "vitest";
import { validate, itemContract, itemListContract, statContract } from "./armoryContract";

import listFixture from "./fixtures/list.json";
import itemFixture from "./fixtures/item.json";
import createdFixture from "./fixtures/created.json";
import deletedFixture from "./fixtures/deleted.json";
import createStoreFixture from "./fixtures/createStore.json";

// These fixtures were recorded from the legacy AWS armory
// (https://v8z4x819qk.execute-api.us-east-1.amazonaws.com/dev) on 2026-06-21.
// They pin the response SHAPE the new Vercel API must reproduce. Values are
// irrelevant — only structure is asserted.
describe("legacy armory response contract (recorded fixtures)", () => {
    it("GET /items → Item[]", () => {
        expect(validate(itemListContract, listFixture)).toEqual([]);
    });

    it("GET /items/{id} → Item", () => {
        expect(validate(itemContract, itemFixture)).toEqual([]);
    });

    it("POST /items → Item (the created item)", () => {
        expect(validate(itemContract, createdFixture)).toEqual([]);
    });

    it("DELETE /items/{id} → Item (the deleted item, ReturnValues ALL_OLD)", () => {
        expect(validate(itemContract, deletedFixture)).toEqual([]);
    });

    it("POST /createStore → Item[]", () => {
        expect(validate(itemListContract, createStoreFixture)).toEqual([]);
    });

    // POST /clearStore is destructive (it drops and recreates the table), so it
    // is never exercised against the live store. Its handler returns a
    // plain-text string body ("Success, store cleared!"); the contract is simply
    // a non-empty string. The new API must match this — a string body, not JSON.
    it("POST /clearStore → non-empty string body", () => {
        const clearStoreResponse = "Success, store cleared!";
        expect(typeof clearStoreResponse).toBe("string");
        expect(clearStoreResponse.length).toBeGreaterThan(0);
    });
});

// Sanity checks that the validator itself rejects malformed shapes — otherwise
// an empty-error result would be meaningless as a yardstick.
describe("contract validator rejects mismatches", () => {
    it("flags a missing required field", () => {
        const { createdAt, ...withoutCreatedAt } = itemFixture;
        void createdAt;
        expect(validate(itemContract, withoutCreatedAt)).toContain(
            "$.createdAt: missing required field"
        );
    });

    it("flags a wrong type", () => {
        expect(validate(statContract, { id: "x", name: "y", value: "10" })).toContain(
            "$.value: expected number, got string"
        );
    });

    it("flags an unexpected field", () => {
        expect(validate(statContract, { id: "x", name: "y", value: 10, extra: true })).toContain(
            "$.extra: unexpected field"
        );
    });
});

// Opt-in characterisation of the *live* legacy endpoint, proving the recorded
// fixtures still reflect reality. Read-only (GET) calls only — no create, delete
// or clearStore against the live store. Enable with:
//   ARMORY_LIVE_URL=https://<host>/dev npm test
const LIVE_URL = process.env.ARMORY_LIVE_URL;

describe.skipIf(!LIVE_URL)("live legacy armory conforms to the contract", () => {
    it("GET /items → Item[]", async () => {
        const res = await fetch(`${LIVE_URL}/items`);
        expect(res.ok).toBe(true);
        const body = await res.json();
        expect(validate(itemListContract, body)).toEqual([]);
    });

    it("GET /items/{id} → Item", async () => {
        const list = (await (await fetch(`${LIVE_URL}/items`)).json()) as Array<{ id: string }>;
        expect(list.length).toBeGreaterThan(0);
        const res = await fetch(`${LIVE_URL}/items/${list[0]!.id}`);
        expect(res.ok).toBe(true);
        const body = await res.json();
        expect(validate(itemContract, body)).toEqual([]);
    });
});
