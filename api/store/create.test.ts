// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

vi.mock("@vercel/kv", () => ({
    kv: {
        hset: vi.fn(),
    },
}));

vi.mock("uuid", () => ({
    v4: vi.fn().mockReturnValueOnce("id-1").mockReturnValueOnce("id-2").mockReturnValue("id-n"),
}));

vi.mock("../_lib/generateItem", () => ({
    generateItem: vi.fn(() => ({
        name: "Batch Item",
        category: "axe",
        set: "weapon",
        quality: "common",
        qualitySort: 1,
        cost: 5,
        pool: 20,
        icon: "axe_1",
        stats: [],
    })),
}));

import { kv } from "@vercel/kv";
import handler from "./create";

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

describe("POST /api/store/create", () => {
    beforeEach(() => vi.clearAllMocks());

    it("generates 1 item by default", async () => {
        vi.mocked(kv.hset).mockResolvedValue(1);
        const res = makeRes();
        await handler(makeReq("POST", {}), res);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect((res.body as unknown[]).length).toBe(1);
    });

    it("generates N items when amount is given", async () => {
        vi.mocked(kv.hset).mockResolvedValue(2);
        const res = makeRes();
        await handler(makeReq("POST", { amount: 2 }), res);
        expect(res.statusCode).toBe(200);
        expect((res.body as unknown[]).length).toBe(2);
    });

    it("bulk-stores all items in one hset call", async () => {
        vi.mocked(kv.hset).mockResolvedValue(2);
        const res = makeRes();
        await handler(makeReq("POST", { amount: 2 }), res);
        expect(kv.hset).toHaveBeenCalledTimes(1);
        expect(kv.hset).toHaveBeenCalledWith("items", expect.any(Object));
    });

    it("returns 405 for GET", async () => {
        const res = makeRes();
        await handler(makeReq("GET"), res);
        expect(res.statusCode).toBe(405);
    });
});
