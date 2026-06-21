# Armory API (`/api/armory`)

The armory item service, running as Vercel Functions backed by Vercel KV. This is
the Phase 7 replacement for the legacy AWS Lambda + DynamoDB service in
`services/armory/` — it produces **structurally identical** responses (see the
shared contract in `test/contract/armoryContract.ts`). Nothing here is wired to
the frontend yet; that happens in Phase 8 (PR3).

## Endpoints

| Method   | Path                       | Description                                               | Legacy equivalent    |
| -------- | -------------------------- | --------------------------------------------------------- | -------------------- |
| `GET`    | `/api/armory/items`        | List all items                                            | `GET /items`         |
| `POST`   | `/api/armory/items`        | Generate + store one item (optional body overrides)       | `POST /items`        |
| `GET`    | `/api/armory/items/:id`    | Get one item                                              | `GET /items/{id}`    |
| `DELETE` | `/api/armory/items/:id`    | Remove + return one item                                  | `DELETE /items/{id}` |
| `POST`   | `/api/armory/store/create` | Batch-generate N items (`{ amount }`, default 1, max 200) | `POST /createStore`  |
| `POST`   | `/api/armory/store/clear`  | Empty the store (plain-text body)                         | `POST /clearStore`   |

## Storage

Items live in a single Redis hash (`armory:items`, field = item id, value = the
item). The handlers depend only on the `ItemStore` interface (`_lib/itemStore.ts`):

- **MemoryItemStore** — a `Map`, used by tests, the smoke harness, and local dev.
- **RedisItemStore** — a Redis client (`ioredis`) over the `REDIS_URL` connection
  string injected by the Vercel KV / Upstash store.

The factory uses Redis when `REDIS_URL` is present, otherwise falls back to the
in-memory store, so nothing breaks before the store is provisioned.

## Verifying it standalone (no infra)

```bash
npm run armory:smoke   # watch generate → store → list → retrieve → delete
npm test               # api/armory/handlers.test.ts asserts the full flow + contract parity
```

## Production (maintainer)

1. Create a Vercel KV / Upstash Redis store and connect it to the project —
   Vercel injects `REDIS_URL` automatically.
2. Deploy. The functions are picked up from `api/` with no extra config.
