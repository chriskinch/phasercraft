import { describe, it, expect, beforeEach } from "vitest";

import sessionCreateHandler from "./session/index";
import sessionByCodeHandler from "./session/[code]";

import { MemoryCoopSessionStore, setCoopSessionStore } from "./_lib/sessionStore";
import { generateJoinCode, isValidJoinCode, normalizeJoinCode, CODE_LENGTH } from "./_lib/code";
import { SESSION_TTL_SECONDS } from "./_lib/types";
import type { ApiRequest, ApiResponse } from "../armory/_lib/http";

interface Captured {
    statusCode: number;
    json: unknown;
    headers: Record<string, string>;
    ended: boolean;
}

const mockRes = (): { res: ApiResponse; captured: Captured } => {
    const captured: Captured = { statusCode: 0, json: undefined, headers: {}, ended: false };
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
        send() {},
        end() {
            captured.ended = true;
        },
    };
    return { res, captured };
};

type Handler = (req: ApiRequest, res: ApiResponse) => Promise<void>;

const run = async (
    handler: Handler,
    method: string,
    opts: { query?: ApiRequest["query"]; body?: unknown } = {}
): Promise<Captured> => {
    const { res, captured } = mockRes();
    await handler({ method, query: opts.query, body: opts.body }, res);
    return captured;
};

const offer = { type: "offer", sdp: "v=0 host-offer" };
const answer = { type: "answer", sdp: "v=0 guest-answer" };

beforeEach(() => {
    setCoopSessionStore(new MemoryCoopSessionStore());
});

describe("POST /api/coop/session", () => {
    it("creates a session and returns a valid join code", async () => {
        const created = await run(sessionCreateHandler, "POST", { body: { offer } });
        expect(created.statusCode).toBe(201);
        const { code } = created.json as { code: string };
        expect(isValidJoinCode(code)).toBe(true);
    });

    it("rejects a missing or malformed offer", async () => {
        expect((await run(sessionCreateHandler, "POST", { body: {} })).statusCode).toBe(400);
        expect(
            (
                await run(sessionCreateHandler, "POST", {
                    body: { offer: { type: "answer", sdp: "x" } },
                })
            ).statusCode
        ).toBe(400);
        expect(
            (
                await run(sessionCreateHandler, "POST", {
                    body: { offer: { type: "offer", sdp: "" } },
                })
            ).statusCode
        ).toBe(400);
    });

    it("rejects non-POST methods", async () => {
        expect((await run(sessionCreateHandler, "GET")).statusCode).toBe(405);
    });
});

describe("GET/POST /api/coop/session/:code", () => {
    const createSession = async (): Promise<string> => {
        const created = await run(sessionCreateHandler, "POST", { body: { offer } });
        return (created.json as { code: string }).code;
    };

    it("hands the offer to the guest and relays the answer back to the host", async () => {
        const code = await createSession();

        // Guest fetches the offer (case-insensitive code entry).
        const fetched = await run(sessionByCodeHandler, "GET", {
            query: { code: code.toLowerCase() },
        });
        expect(fetched.statusCode).toBe(200);
        expect(fetched.json).toEqual({ offer, answer: null });

        // Guest posts its answer.
        const posted = await run(sessionByCodeHandler, "POST", {
            query: { code },
            body: { answer },
        });
        expect(posted.statusCode).toBe(200);

        // Host's poll now sees the answer.
        const polled = await run(sessionByCodeHandler, "GET", { query: { code } });
        expect(polled.json).toEqual({ offer, answer });
    });

    it("404s an unknown code and 400s a malformed one", async () => {
        const unknown = await run(sessionByCodeHandler, "GET", { query: { code: "ZZZZZ" } });
        expect(unknown.statusCode).toBe(404);

        const malformed = await run(sessionByCodeHandler, "GET", { query: { code: "nope!!" } });
        expect(malformed.statusCode).toBe(400);

        const orphanAnswer = await run(sessionByCodeHandler, "POST", {
            query: { code: "ZZZZZ" },
            body: { answer },
        });
        expect(orphanAnswer.statusCode).toBe(404);
    });

    it("rejects a malformed answer", async () => {
        const code = await createSession();
        const bad = await run(sessionByCodeHandler, "POST", {
            query: { code },
            body: { answer: { type: "offer", sdp: "x" } },
        });
        expect(bad.statusCode).toBe(400);
    });
});

describe("MemoryCoopSessionStore TTL", () => {
    it("expires sessions after SESSION_TTL_SECONDS", async () => {
        let now = 1_000_000;
        const store = new MemoryCoopSessionStore(() => now);
        await store.create("ABCDE", { type: "offer", sdp: "x" });

        now += (SESSION_TTL_SECONDS - 1) * 1000;
        expect(await store.get("ABCDE")).not.toBeNull();

        now += 2000;
        expect(await store.get("ABCDE")).toBeNull();
        expect(await store.setAnswer("ABCDE", { type: "answer", sdp: "y" })).toBe(false);
    });

    it("create refuses to clobber a live session", async () => {
        const store = new MemoryCoopSessionStore();
        expect(await store.create("ABCDE", { type: "offer", sdp: "x" })).toBe(true);
        expect(await store.create("ABCDE", { type: "offer", sdp: "other" })).toBe(false);
    });
});

describe("join codes", () => {
    it("generates codes of the right shape", () => {
        for (let i = 0; i < 200; i++) {
            const code = generateJoinCode();
            expect(code).toHaveLength(CODE_LENGTH);
            expect(isValidJoinCode(code)).toBe(true);
            // No ambiguous glyphs.
            expect(code).not.toMatch(/[01OIL]/);
        }
    });

    it("normalizes user-typed codes", () => {
        expect(normalizeJoinCode("  abcde ")).toBe("ABCDE");
    });
});
