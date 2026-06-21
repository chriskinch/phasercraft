import { describe, it, expect, beforeEach } from "vitest";

import itemsHandler from "./items/index";
import itemByIdHandler from "./items/[id]";
import storeCreateHandler from "./store/create";
import storeClearHandler from "./store/clear";

import { MemoryItemStore, setItemStore } from "./_lib/itemStore";
import type { ApiRequest, ApiResponse } from "./_lib/http";
import type { StoredItem } from "./_lib/types";
import { validate, itemContract, itemListContract } from "../../test/contract/armoryContract";

interface Captured {
    statusCode: number;
    json: unknown;
    text: string | undefined;
    headers: Record<string, string>;
    ended: boolean;
}

const mockRes = (): { res: ApiResponse; captured: Captured } => {
    const captured: Captured = {
        statusCode: 0,
        json: undefined,
        text: undefined,
        headers: {},
        ended: false,
    };
    const res: ApiResponse = {
        setHeader(name, value) {
            captured.headers[name] = value;
        },
        status(code) {
            captured.statusCode = code;
            return res;
        },
        json(body) {
            captured.json = body;
        },
        send(body) {
            captured.text = body;
        },
        end() {
            captured.ended = true;
        },
    };
    return { res, captured };
};

const mockReq = (
    method: string,
    opts: { query?: ApiRequest["query"]; body?: unknown } = {}
): ApiRequest => ({ method, query: opts.query, body: opts.body });

type Handler = (req: ApiRequest, res: ApiResponse) => Promise<void>;

const run = async (
    handler: Handler,
    method: string,
    opts: { query?: ApiRequest["query"]; body?: unknown } = {}
): Promise<Captured> => {
    const { res, captured } = mockRes();
    await handler(mockReq(method, opts), res);
    return captured;
};

beforeEach(() => {
    setItemStore(new MemoryItemStore());
});

describe("POST/GET /api/armory/items", () => {
    it("creates an item (contract-valid) and lists it", async () => {
        const created = await run(itemsHandler, "POST", { body: {} });
        expect(created.statusCode).toBe(200);
        expect(validate(itemContract, created.json)).toEqual([]);

        const listed = await run(itemsHandler, "GET");
        expect(listed.statusCode).toBe(200);
        expect(validate(itemListContract, listed.json)).toEqual([]);
        expect(listed.json as StoredItem[]).toHaveLength(1);
        expect((listed.json as StoredItem[])[0]!.id).toBe((created.json as StoredItem).id);
    });

    it("applies body overrides on create", async () => {
        const created = await run(itemsHandler, "POST", {
            body: { name: "Override Blade", category: "sword", quality: "epic" },
        });
        const item = created.json as StoredItem;
        expect(item.name).toBe("Override Blade");
        expect(item.category).toBe("sword");
        expect(item.quality).toBe("epic");
    });

    it("rejects an unsupported method with 405 + Allow header", async () => {
        const res = await run(itemsHandler, "PUT");
        expect(res.statusCode).toBe(405);
        expect(res.headers["Allow"]).toContain("GET");
    });

    it("answers a CORS preflight", async () => {
        const res = await run(itemsHandler, "OPTIONS");
        expect(res.statusCode).toBe(204);
        expect(res.ended).toBe(true);
        expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    });
});

describe("GET/DELETE /api/armory/items/[id]", () => {
    it("gets an item by id", async () => {
        const created = (await run(itemsHandler, "POST", { body: {} })).json as StoredItem;
        const got = await run(itemByIdHandler, "GET", { query: { id: created.id } });
        expect(got.statusCode).toBe(200);
        expect(validate(itemContract, got.json)).toEqual([]);
        expect((got.json as StoredItem).id).toBe(created.id);
    });

    it("returns 404 for a missing id on GET and DELETE", async () => {
        expect((await run(itemByIdHandler, "GET", { query: { id: "missing" } })).statusCode).toBe(
            404
        );
        expect(
            (await run(itemByIdHandler, "DELETE", { query: { id: "missing" } })).statusCode
        ).toBe(404);
    });

    it("returns 400 when the id is absent", async () => {
        expect((await run(itemByIdHandler, "GET")).statusCode).toBe(400);
    });

    it("deletes an item and returns it (contract-valid)", async () => {
        const created = (await run(itemsHandler, "POST", { body: {} })).json as StoredItem;
        const deleted = await run(itemByIdHandler, "DELETE", { query: { id: created.id } });
        expect(deleted.statusCode).toBe(200);
        expect(validate(itemContract, deleted.json)).toEqual([]);
        expect((deleted.json as StoredItem).id).toBe(created.id);
        // Gone afterwards.
        expect((await run(itemByIdHandler, "GET", { query: { id: created.id } })).statusCode).toBe(
            404
        );
    });
});

describe("POST /api/armory/store/create", () => {
    it("batch-generates N contract-valid items", async () => {
        const res = await run(storeCreateHandler, "POST", { body: { amount: 5 } });
        expect(res.statusCode).toBe(200);
        expect(validate(itemListContract, res.json)).toEqual([]);
        expect(res.json as StoredItem[]).toHaveLength(5);
        expect((await run(itemsHandler, "GET")).json as StoredItem[]).toHaveLength(5);
    });

    it("defaults to a single item when no amount is given", async () => {
        const res = await run(storeCreateHandler, "POST", { body: {} });
        expect(res.json as StoredItem[]).toHaveLength(1);
    });

    it("rejects an invalid amount with 400", async () => {
        expect((await run(storeCreateHandler, "POST", { body: { amount: 0 } })).statusCode).toBe(
            400
        );
        expect((await run(storeCreateHandler, "POST", { body: { amount: 1.5 } })).statusCode).toBe(
            400
        );
        expect((await run(storeCreateHandler, "POST", { body: { amount: 9999 } })).statusCode).toBe(
            400
        );
    });
});

describe("POST /api/armory/store/clear", () => {
    it("empties the store and returns the legacy plain-text body", async () => {
        await run(storeCreateHandler, "POST", { body: { amount: 3 } });
        const res = await run(storeClearHandler, "POST");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("Success, store cleared!");
        expect(res.headers["Content-Type"]).toBe("text/plain");
        expect((await run(itemsHandler, "GET")).json as StoredItem[]).toEqual([]);
    });
});

describe("full CRUD smoke through the handlers", () => {
    it("clear → stock(5) → list → get → delete → list", async () => {
        await run(storeClearHandler, "POST");

        const stocked = await run(storeCreateHandler, "POST", { body: { amount: 5 } });
        expect(validate(itemListContract, stocked.json)).toEqual([]);

        const list = (await run(itemsHandler, "GET")).json as StoredItem[];
        expect(list).toHaveLength(5);

        const target = list[0]!;
        const got = await run(itemByIdHandler, "GET", { query: { id: target.id } });
        expect((got.json as StoredItem).id).toBe(target.id);

        const deleted = await run(itemByIdHandler, "DELETE", { query: { id: target.id } });
        expect((deleted.json as StoredItem).id).toBe(target.id);

        expect((await run(itemsHandler, "GET")).json as StoredItem[]).toHaveLength(4);
    });
});
