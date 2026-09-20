// Coins and gems are worth a flat amount on pickup, scaled by the
// `coin_multiplier` of whatever dropped them (1 for most creatures, higher for
// tougher ones and for area bosses — see `enemies.json` and `BOSS_SCALING`).
//
// The result is rounded so the store only ever takes whole coins, and floored
// at the base value so a multiplier below 1 can never make a drop worthless.
export default function coinValue(base: number, multiplier: number = 1): number {
    return Math.max(base, Math.round(base * multiplier));
}
