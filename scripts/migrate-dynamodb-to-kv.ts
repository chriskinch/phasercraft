/**
 * One-time migration: reads all items from the existing AWS Lambda endpoint
 * and writes them to Vercel KV via the new Vercel Functions endpoint.
 *
 * Usage:
 *   ARMORY_AWS_URL=https://... ARMORY_VERCEL_URL=https://... npx tsx scripts/migrate-dynamodb-to-kv.ts
 *
 * Run this before retiring the AWS Lambda service.
 */

const awsUrl = process.env.ARMORY_AWS_URL;
const vercelUrl = process.env.ARMORY_VERCEL_URL;

if (!awsUrl || !vercelUrl) {
    console.error(
        "Set ARMORY_AWS_URL (existing Lambda endpoint) and ARMORY_VERCEL_URL (new Vercel endpoint)"
    );
    process.exit(1);
}

interface Stat {
    id: string;
    name: string;
    value: number;
}

interface Item {
    id: string;
    createdAt: number;
    name: string;
    category: string;
    set: string;
    quality: string;
    qualitySort: number;
    cost: number;
    pool: number;
    icon: string;
    stats: Stat[];
}

async function migrate() {
    console.log(`Reading items from ${awsUrl}/items …`);
    const listRes = await fetch(`${awsUrl}/items`);
    if (!listRes.ok) {
        throw new Error(`Failed to list items: ${listRes.status} ${listRes.statusText}`);
    }
    const items: Item[] = (await listRes.json()) as Item[];
    console.log(`  Found ${items.length} item(s).`);

    let success = 0;
    let failure = 0;

    for (const item of items) {
        const writeRes = await fetch(`${vercelUrl}/api/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        });
        if (writeRes.ok) {
            success++;
        } else {
            console.error(
                `  Failed to write item ${item.id}: ${writeRes.status} ${writeRes.statusText}`
            );
            failure++;
        }
    }

    console.log(`Migration complete: ${success} succeeded, ${failure} failed.`);
}

migrate().catch((err) => {
    console.error(err);
    process.exit(1);
});
