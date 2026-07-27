import { describe, it, expect } from "vitest";
import { promoteToBoss } from "./bosses";
import enemyTypes from "./enemies.json";
import type { EnemyConfig, EnemyType } from "@/types/game";

const ALL: EnemyType[] = Object.keys(enemyTypes) as EnemyType[];

describe("promoteToBoss", () => {
    it("scales damage, health and speed off the base creature", () => {
        const base = enemyTypes["baby-ghoul"] as EnemyConfig;
        const boss = promoteToBoss("baby-ghoul");

        expect(boss.damage).toBe(base.damage * 3);
        expect(boss.health_max).toBe(base.health_max * 6);
        expect(boss.speed).toBeCloseTo(base.speed * 0.6);
    });

    it("forces every creature into a short-range melee brawler", () => {
        // The imp is Ranged with 200 range; a boss closes and brawls regardless.
        const boss = promoteToBoss("imp");

        expect(boss.type).toBe("Melee");
        expect(boss.range).toBe(60);
        expect(boss.aggro_radius).toBe(80);
    });

    it("applies the boss coin multiplier", () => {
        expect(promoteToBoss("slime").coin_multiplier).toBe(10);
    });

    it("carries the base creature's loot table and attack speed through", () => {
        const base = enemyTypes.satyr as EnemyConfig;
        const boss = promoteToBoss("satyr");

        expect(boss.loot_table).toEqual(base.loot_table);
        expect(boss.attack_speed).toBe(base.attack_speed);
    });

    it("produces a usable boss for every creature in enemies.json", () => {
        // Any creature can be drawn as a biome's boss, so none may promote to
        // something the Enemy constructor would choke on.
        ALL.forEach((id) => {
            const boss = promoteToBoss(id);
            expect(boss.type).toBe("Melee");
            expect(boss.damage).toBeGreaterThan(0);
            expect(boss.health_max).toBeGreaterThan(0);
            expect(boss.speed).toBeGreaterThan(0);
        });
    });

    it("does not mutate the source config", () => {
        const before = JSON.stringify(enemyTypes.ghoul);
        promoteToBoss("ghoul");
        expect(JSON.stringify(enemyTypes.ghoul)).toBe(before);
    });
});
