// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

vi.mock("@vercel/kv", () => ({
    kv: {
        del: vi.fn(),
    },
}));

import { kv } from "@vercel/kv";
import handler from "./clear";

function makeReq(method: string): VercelRequest {
    return { method } as VercelRequest;
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

describe("POST /api/store/clear", () => {
    beforeEach(() => vi.clearAllMocks());

    it("deletes the items hash and returns success", async () => {
        vi.mocked(kv.del).mockResolvedValue(1);
        const res = makeRes();
        await handler(makeReq("POST"), res);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Store cleared" });
        expect(kv.del).toHaveBeenCalledWith("items");
    });

    it("returns 405 for GET", async () => {
        const res = makeRes();
        await handler(makeReq("GET"), res);
        expect(res.statusCode).toBe(405);
        expect(kv.del).not.toHaveBeenCalled();
    });
});
