// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

vi.mock("@vercel/kv", () => ({
    kv: {
        hget: vi.fn(),
        hdel: vi.fn(),
    },
}));

import { kv } from "@vercel/kv";
import handler from "./[id]";

const ITEM = {
    id: "item-123",
    name: "Test Sword",
    category: "sword",
    set: "weapon",
    quality: "rare",
    qualitySort: 3,
    cost: 40,
    pool: 60,
    icon: "sword_5",
    createdAt: 1000,
    stats: [],
};

function makeReq(method: string, id?: string | string[]): VercelRequest {
    const query = id !== undefined ? { id } : {};
    return { method, query } as unknown as VercelRequest;
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

describe("GET /api/items/[id]", () => {
    beforeEach(() => vi.clearAllMocks());

    it("returns the item when found", async () => {
        vi.mocked(kv.hget).mockResolvedValue(ITEM);
        const res = makeRes();
        await handler(makeReq("GET", "item-123"), res);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(ITEM);
    });

    it("returns 404 when item not found", async () => {
        vi.mocked(kv.hget).mockResolvedValue(null);
        const res = makeRes();
        await handler(makeReq("GET", "unknown-id"), res);
        expect(res.statusCode).toBe(404);
    });

    it("returns 400 for missing id", async () => {
        const res = makeRes();
        await handler(makeReq("GET"), res);
        expect(res.statusCode).toBe(400);
    });

    it("returns 400 for array id", async () => {
        const res = makeRes();
        await handler(makeReq("GET", ["a", "b"]), res);
        expect(res.statusCode).toBe(400);
    });
});

describe("DELETE /api/items/[id]", () => {
    beforeEach(() => vi.clearAllMocks());

    it("deletes the item and returns it", async () => {
        vi.mocked(kv.hget).mockResolvedValue(ITEM);
        vi.mocked(kv.hdel).mockResolvedValue(1);
        const res = makeRes();
        await handler(makeReq("DELETE", "item-123"), res);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(ITEM);
        expect(kv.hdel).toHaveBeenCalledWith("items", "item-123");
    });

    it("returns 404 when item to delete is not found", async () => {
        vi.mocked(kv.hget).mockResolvedValue(null);
        const res = makeRes();
        await handler(makeReq("DELETE", "unknown-id"), res);
        expect(res.statusCode).toBe(404);
        expect(kv.hdel).not.toHaveBeenCalled();
    });
});

describe("unsupported methods", () => {
    it("returns 405 for PATCH", async () => {
        const res = makeRes();
        await handler(makeReq("PATCH", "item-123"), res);
        expect(res.statusCode).toBe(405);
    });
});
