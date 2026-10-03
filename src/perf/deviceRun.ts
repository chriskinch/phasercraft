import { Core, Scenes, type Game } from "phaser";
import { readSettings, writeSettings } from "@services/settingsStorage";
import type { FrameSummary, PerfApi, PerfResult, PerfScenarioOptions } from "./types";

// On-device runs (#502 L4). A perf build opened with `?perf=<scenario>` sends
// a new game straight into the biome and, once there, offers a Start button
// that runs the scenario and prints the numbers on screen. No console or
// Playwright needed, so it works on a phone, alongside a remote devtools trace.
//
//   ?perf=combat&enemies=15            scenario and enemy count
//   &frames=1200&warmup=120&seed=1     optional, same defaults as CI

const SCENARIOS = ["chase", "combat"] as const;

export function parseDeviceRun(search: string): PerfScenarioOptions | null {
    const params = new URLSearchParams(search);
    const scenario = params.get("perf");
    if (!SCENARIOS.includes(scenario as (typeof SCENARIOS)[number])) return null;
    const int = (key: string, fallback: number, min: number) => {
        const raw = params.get(key);
        const value = Number(raw);
        return raw !== null && raw !== "" && Number.isInteger(value) && value >= min
            ? value
            : fallback;
    };
    return {
        scenario: scenario as PerfScenarioOptions["scenario"],
        enemies: int("enemies", 15, 1),
        seed: int("seed", 1, 0),
        warmupFrames: int("warmup", 120, 0),
        sampleFrames: int("frames", 1200, 1),
    };
}

const row = (label: string, s: FrameSummary) =>
    `${label.padEnd(6)} p50 ${s.p50}  p95 ${s.p95}  p99 ${s.p99}  max ${s.max}  >16.7: ${s.over16_7}  >50: ${s.over50}`;

export function formatResult(result: PerfResult): string {
    const { counts } = result;
    return [
        `${result.scenario} × ${result.enemies}  (${result.sampleFrames} frames, seed ${result.seed})`,
        row("frame", result.frame),
        row("work", result.work),
        `bodies ${counts.max.bodies}  timers ${counts.max.timers}  objects ${counts.max.gameObjects}  graphics ${counts.max.graphics}`,
        result.heapMB ? `heap ${result.heapMB.start} → ${result.heapMB.end} MB` : "heap n/a",
    ].join("\n");
}

function overlay(): {
    text(value: string): void;
    button(label: string, onClick: () => void): void;
} {
    const box = document.createElement("div");
    box.style.cssText =
        "position:fixed;top:8px;left:8px;z-index:2147483647;max-width:calc(100vw - 16px);" +
        "padding:8px 10px;background:rgba(0,0,0,.82);color:#fff;font:12px/1.4 monospace;" +
        "white-space:pre-wrap;border-radius:6px";
    const text = document.createElement("div");
    const buttons = document.createElement("div");
    buttons.style.cssText = "display:flex;gap:8px;margin-top:6px";
    box.append(text, buttons);
    document.body.append(box);
    return {
        text: (value) => {
            text.textContent = value;
            buttons.replaceChildren();
        },
        button: (label, onClick) => {
            const button = document.createElement("button");
            button.textContent = label;
            button.style.cssText = "font:inherit;padding:6px 10px";
            button.onclick = onClick;
            buttons.append(button);
        },
    };
}

export function startDeviceRun(game: Game, api: PerfApi, options: PerfScenarioOptions): void {
    // A new game lands straight in the biome, as in CI. Perf builds are served
    // from their own origin, so this never touches a player's real settings.
    writeSettings({ ...readSettings(), godMode: true, startLocation: "combat" });

    const ui = overlay();
    const label = `${options.scenario} × ${options.enemies}`;
    ui.text(`Perf ${label}\nNew Game → any slot → Warrior.`);

    const offerStart = (message: string) => {
        ui.text(message);
        ui.button("Start", () => {
            ui.text(`Running ${label}… (${options.warmupFrames + options.sampleFrames} frames)`);
            api.run(options)
                .then((result) => {
                    ui.text(formatResult(result));
                    ui.button("Copy JSON", () => {
                        void navigator.clipboard?.writeText(JSON.stringify(result, null, 2));
                    });
                    ui.button("Run again", () =>
                        offerStart(`Perf ${label}: start a trace, then Start.`)
                    );
                })
                .catch((error: unknown) => ui.text(`Perf run failed: ${String(error)}`));
        });
    };

    const watch = () => {
        const scene = game.scene.getScene("BiomeScene");
        if (!scene) return;
        // run() restarts the scene itself, so start from the step after create.
        scene.events.once(Scenes.Events.CREATE, () => {
            game.events.once(Core.Events.POST_STEP, () =>
                offerStart(`Perf ${label}: start a trace if you want one, then Start.`)
            );
        });
    };
    if (game.isBooted) watch();
    else game.events.once(Core.Events.READY, watch);
}
