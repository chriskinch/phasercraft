// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

vi.mock("@vercel/kv", () => ({
    kv: {
        hgetall: vi.fn(),
        hset: vi.fn(),
    },
}));

vi.mock("uuid", () => ({ v4: vi.fn(() => "new-item-id") }));

vi.mock("../_lib/generateItem", () => ({
    generateItem: vi.fn(() => ({
        name: "Generated Item",
        category: "sword",
        set: "weapon",
        quality: "common",
        qualitySort: 1,
        cost: 5,
        pool: 20,
        icon: "sword_1",
        stats: [{ id: "s1", name: "attack_power", value: 10 }],
    })),
}));

import { kv } from "@vercel/kv";
import handler from "./index";

function makeReq(method: string, body?: unknown): VercelRequest {
    return { method, body } as VercelRequest;
}

function makeRes() {
    let statusCode = 0;
    let body: unknown = null;
    const res = {
        get statusCode() {
            return statusCode;
        },
        get body() {
            return body;
        },
        status(code: number) {
            statusCode = code;
            return res;
        },
        json(data: unknown) {
            body = data;
            return res;
        },
    };
    return res as unknown as VercelResponse & {
        statusCode: number;
        body: unknown;
    };
}

describe("GET /api/items", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns empty array when store is empty", async () => {
        vi.mocked(kv.hgetall).mockResolvedValue(null);
        const res = makeRes();
        await handler(makeReq("GET"), res);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("returns all items from KV", async () => {
        const item = {
            id: "abc",
            name: "Test Item",
            category: "sword",
            stats: [],
        };
        vi.mocked(kv.hgetall).mockResolvedValue({ abc: item });
        const res = makeRes();
        await handler(makeReq("GET"), res);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([item]);
    });
});

describe("POST /api/items", () => {
    beforeEach(() => vi.clearAllMocks());

    it("creates a new item and returns 201", async () => {
        vi.mocked(kv.hset).mockResolvedValue(1);
        const res = makeRes();
        await handler(makeReq("POST", {}), res);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            id: "new-item-id",
            name: "Generated Item",
        });
    });

    it("stores item in KV with its id as field", async () => {
        vi.mocked(kv.hset).mockResolvedValue(1);
        const res = makeRes();
        await handler(makeReq("POST", {}), res);
        expect(kv.hset).toHaveBeenCalledWith(
            "items",
            expect.objectContaining({
                "new-item-id": expect.objectContaining({ id: "new-item-id" }),
            })
        );
    });
});

describe("unsupported methods", () => {
    it("returns 405 for PUT", async () => {
        const res = makeRes();
        await handler(makeReq("PUT"), res);
        expect(res.statusCode).toBe(405);
    });
});
