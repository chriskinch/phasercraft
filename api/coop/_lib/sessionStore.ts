// Storage seam for co-op signaling sessions, following the armory's pattern
// (`api/armory/_lib/itemStore.ts`): handlers depend only on the interface, the
// implementation is chosen at runtime — Redis when `REDIS_URL` is present
// (the Vercel KV / Upstash store), an in-memory Map otherwise (tests, the
// Vite dev middleware, and local runs with zero infra).
//
// Sessions are individual keys (`coop:session:<code>`) with a TTL rather than
// a hash, so Redis expires abandoned handshakes on its own.

import type Redis from "ioredis";
import type { CoopSessionRecord, CoopSignal } from "./types";
import { SESSION_TTL_SECONDS } from "./types";

const keyFor = (code: string): string => `coop:session:${code}`;

export interface CoopSessionStore {
    /** Creates a session under `code`. Returns false if the code is taken. */
    create(code: string, offer: CoopSignal): Promise<boolean>;
    get(code: string): Promise<CoopSessionRecord | null>;
    /** Records the guest's answer. Returns false if the session is missing/expired. */
    setAnswer(code: string, answer: CoopSignal): Promise<boolean>;
}

interface MemoryEntry {
    record: CoopSessionRecord;
    expiresAt: number;
}

export class MemoryCoopSessionStore implements CoopSessionStore {
    private sessions = new Map<string, MemoryEntry>();
    // Injectable clock so tests can drive expiry without real waits.
    constructor(private now: () => number = Date.now) {}

    private live(code: string): MemoryEntry | null {
        const entry = this.sessions.get(code);
        if (!entry) return null;
        if (entry.expiresAt <= this.now()) {
            this.sessions.delete(code);
            return null;
        }
        return entry;
    }

    async create(code: string, offer: CoopSignal): Promise<boolean> {
        if (this.live(code)) return false;
        this.sessions.set(code, {
            record: { offer, answer: null, createdAt: this.now() },
            expiresAt: this.now() + SESSION_TTL_SECONDS * 1000,
        });
        return true;
    }

    async get(code: string): Promise<CoopSessionRecord | null> {
        const entry = this.live(code);
        return entry ? structuredClone(entry.record) : null;
    }

    async setAnswer(code: string, answer: CoopSignal): Promise<boolean> {
        const entry = this.live(code);
        if (!entry) return false;
        entry.record.answer = structuredClone(answer);
        return true;
    }
}

// One client per warm function instance; same fail-fast tuning as the armory
// store (see itemStore.ts for the rationale).
let redis: Redis | null = null;
const client = async (): Promise<Redis> => {
    if (redis) return redis;
    const { default: RedisCtor } = await import("ioredis");
    redis = new RedisCtor(process.env.REDIS_URL as string, {
        connectTimeout: 10000,
        maxRetriesPerRequest: 5,
        retryStrategy: (times: number) => (times > 5 ? null : Math.min(times * 200, 2000)),
    });
    return redis;
};

export class RedisCoopSessionStore implements CoopSessionStore {
    async create(code: string, offer: CoopSignal): Promise<boolean> {
        const record: CoopSessionRecord = { offer, answer: null, createdAt: Date.now() };
        // NX so a code collision (or replay) can never clobber a live session.
        const result = await (
            await client()
        ).set(keyFor(code), JSON.stringify(record), "EX", SESSION_TTL_SECONDS, "NX");
        return result === "OK";
    }

    async get(code: string): Promise<CoopSessionRecord | null> {
        const raw = await (await client()).get(keyFor(code));
        return raw ? (JSON.parse(raw) as CoopSessionRecord) : null;
    }

    async setAnswer(code: string, answer: CoopSignal): Promise<boolean> {
        const conn = await client();
        const raw = await conn.get(keyFor(code));
        if (!raw) return false;
        const record = JSON.parse(raw) as CoopSessionRecord;
        record.answer = answer;
        // KEEPTTL: answering must not extend the session's lifetime.
        const result = await conn.set(keyFor(code), JSON.stringify(record), "KEEPTTL");
        return result === "OK";
    }
}

let instance: CoopSessionStore | null = null;

/** Returns the process-wide store, creating it from the environment on first use. */
export const getCoopSessionStore = (): CoopSessionStore =>
    (instance ??= process.env.REDIS_URL
        ? new RedisCoopSessionStore()
        : new MemoryCoopSessionStore());

/** Test/harness hook to inject a store (and reset between tests). */
export const setCoopSessionStore = (store: CoopSessionStore | null): void => {
    instance = store;
};
