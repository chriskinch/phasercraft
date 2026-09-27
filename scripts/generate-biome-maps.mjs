/**
 * Generates the three biome tilemaps (forest / desert / tundra) as Tiled .tmj
 * files under `public/graphics/tilesets/biomes/`.
 *
 * They live in `public/` rather than `assets/` (where the hand-authored town map
 * sits) because they are generated *and* served: at ~1MB each, keeping an
 * `assets/` copy too would put 3MB of duplicate data in git for no gain. The
 * generator is the source; open the files in `public/` directly to inspect them
 * in Tiled.
 *
 *   node scripts/generate-biome-maps.mjs        # writes all three
 *   node scripts/generate-biome-maps.mjs forest # writes one
 *
 * The maps are procedural but *deterministic* — each biome has a fixed seed, so
 * re-running produces byte-identical output and the committed .tmj files stay
 * reviewable in a diff. Tweak the `BIOMES` table below and re-run to iterate on
 * a layout; hand-edits made in Tiled are overwritten, so once a map is being
 * authored by hand it should be dropped from this script.
 *
 * Why a generator rather than hand-authored maps: 300x300 is 90,000 tiles per
 * layer, which is not something you place by hand, and the three biomes share
 * an identical tileset layout (see TILE NOTES) so one algorithm serves all.
 *
 * ── TILE NOTES ────────────────────────────────────────────────────────────────
 * The fantasy_ [version 2.0] pack ships forest_/desert_/tundra_ tilesets that
 * are *pixel-identical in layout* — only the palette differs. So one set of tile
 * indices works for all three biomes.
 *
 * `<biome>_.png` (22x9): ground/water terrain.
 *   - a 3x3 "ground island in water" block at cols 1-3, rows 5-7
 *   - a 2x2 "water hole in ground" block at cols 4-5, rows 5-6 (the inner corners)
 *   - solid ground 46/134, solid water 158
 *   - decorative ground variants: pebbles (30,31,52,53), tufts (32,33,54,55,76,77,98,99)
 *
 * `<biome>Path_.png` (8x5): path over ground, same two-block structure.
 *   - 3x3 "ground island in path" at cols 1-3, rows 1-3
 *   - 2x2 "path patch in ground" at cols 4-5, rows 1-2
 *   - solid path 28
 *
 * `<biome>_ [resources].png` (12x10): props. Vegetation is 2 tiles tall — the
 * canopy tile sits 12 indices above its base (e.g. 13 over 25).
 *
 * Autotiling is corner-based: every tile is chosen from the 4 corners of a
 * (W+1)x(H+1) corner grid, with bits NW=1, NE=2, SW=4, SE=8. The two diagonal
 * masks (6 and 9) have no tile in the pack, so `removeDiagonals` smooths them
 * out of the corner grid before any tile is looked up.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const WIDTH = 300;
const HEIGHT = 300;
const TILE = 16;

// ── corner masks ──────────────────────────────────────────────────────────────

const NW = 1;
const NE = 2;
const SW = 4;
const SE = 8;

/** Ground/water set in `<biome>_.png`. Key = mask of corners that are water. */
const WATER_BY_MASK = {
    0: 46, // all ground
    [SE]: 114,
    [SW]: 115,
    [NE]: 136,
    [NW]: 137,
    [NW | NE]: 112,
    [SW | SE]: 156,
    [NW | SW]: 133,
    [NE | SE]: 135,
    [NW | NE | SW]: 111,
    [NW | NE | SE]: 113,
    [NW | SW | SE]: 155,
    [NE | SW | SE]: 157,
    15: 158, // all water
};

/** Path set in `<biome>Path_.png`. Key = mask of corners that are path. */
const PATH_BY_MASK = {
    0: 0, // no path — leave the terrain layer showing through
    [SE]: 12,
    [SW]: 13,
    [NE]: 20,
    [NW]: 21,
    [NW | NE]: 10,
    [SW | SE]: 26,
    [NW | SW]: 17,
    [NE | SE]: 19,
    [NW | NE | SW]: 9,
    [NW | NE | SE]: 11,
    [NW | SW | SE]: 25,
    [NE | SW | SE]: 27,
    15: 28, // solid path
};

/**
 * Tiles that stop the player, written into the .tmj as `collides: true` tile
 * properties.
 *
 * Arcade collides against the *whole* tile — it ignores Tiled's per-tile
 * collision shapes, which only Matter reads — so a solid tile is as wide as its
 * cell whatever its art does. The props here fill 43-66% of their cell, so
 * expect up to ~3px of slack per side on the slimmest of them (the desert
 * cactus, a 10px trunk in a 16px cell). That is the accepted trade for props
 * that actually block: walking through a boulder reads far worse than a couple
 * of pixels of generous collision.
 *
 * `solidProps` is derived from what each biome actually places (see
 * `solidPropsFor`) rather than hand-listed, so a prop can never be added to a
 * biome and silently stay walk-through.
 */
const SOLID_TERRAIN = [158]; // full water only — shorelines stay walkable

/**
 * Every terrain tile showing any water — the shorelines as well as the full
 * water tile — written into the .tmj as `water: true`. Shorelines are walkable
 * (see `SOLID_TERRAIN`), but enemies must only ever spawn on pure land, and
 * this is how the game tells the two apart.
 */
const WATER_TERRAIN = Object.entries(WATER_BY_MASK)
    .filter(([mask]) => Number(mask) !== 0)
    .map(([, id]) => id);

/**
 * Full-path tiles carrying a scatter of pebble flecks, in `<biome>Path_.png`.
 * Interchangeable with the plain path tile 28 — same edges, just detail in the
 * middle — so one can stand in for the other wherever the path is solid.
 *
 * The town sprinkles these at roughly one flecked tile in four (10 of its 43
 * solid path tiles), which is the density `PATH_DECO_CHANCE` matches.
 */
const PATH_DECO = [14, 22, 29, 30];
const PATH_DECO_CHANCE = 0.22;

/** Ground decoration tiles in `<biome>_.png` — pebble clusters and tufts. */
const GROUND_DECO = [30, 31, 52, 53, 32, 33, 54, 55, 76, 77, 98, 99];

// Props in `<biome>_ [resources].png`. `tall` entries are [canopy, base] pairs
// drawn across two layers; `flat` entries are single tiles.
const BOULDER = { w: 2, h: 2, top: [38, 39], bottom: [50, 51] };

// Resource-sheet sign board, planted beside the entrance road.
const SIGN = 97;

// ── entrance ──────────────────────────────────────────────────────────────────

/**
 * Where the player arrives: a wooden gateway right on the map's top edge near
 * the left corner, in a fence line, with the road running in through it. The
 * strip behind the fence is a row of trees; south of it is a clearing where
 * the player starts, with a trail winding on into the area. Walking back out
 * through the gateway is the way home: the map carries a `town-exit` POI over
 * the opening, which BiomeScene turns into the return-to-town confirmation.
 *
 * All in tile coordinates. The pieces come from `<biome>_ [fencesAndWalls].png`
 * (15x12), whose layout is identical across the biomes like the other sheets:
 *   - gateway: a 3x3 frame (20-22 / 35-37 / 50,52). The middle column is beam
 *     only, so repeating it widens the opening — the stock frame's one-tile gap
 *     is narrower than a character. (65/67 below it look like the posts' feet
 *     but are separate T-junction pieces; stacked under the frame they leave a
 *     visible break in each post.)
 *   - fence: 62 is a run with a post, 34 the vertical run, 48 the corner that
 *     joins a run coming from the west to one heading north.
 */
const ENTRANCE = {
    // Left post column and the row the posts stand on; the fence runs along it.
    // Row 2 puts the top of the frame on the map's first row, so the edge of
    // the map sits just above the beam.
    gateX: 8,
    gateY: 2,
    // Tiles of open road between the posts.
    opening: 3,
    // Column the fence turns north at, closing the pocket off from the east.
    fenceEndX: 22,
    // The player's start, in tiles: on the road, just inside the gate.
    start: { x: 10, y: 5 },
    // Radius, in tiles, of the prop-free clearing around the start.
    clearing: 5,
    // Chance a free pocket tile grows a tree — dense enough to read as a wall.
    pocketDensity: 0.75,
};

/** Tile ids in `<biome>_ [fencesAndWalls].png`. */
const GATE = {
    sliver: [20, 21, 22], // the top pixels of the beam, spilling up a row
    beam: [35, 36, 37], // post tops + beam
    posts: [50, 52], // posts down to the ground, left/right
};
const FENCE_RUN = 62;
const FENCE_VERTICAL = 34;
const FENCE_CORNER = 48;

// ── biome table ───────────────────────────────────────────────────────────────

/**
 * `vegetation` holds [canopy, base] pairs and MUST be two tiles of one
 * continuous prop — a tree's crown directly over its trunk. The canopy goes on
 * `structure props` and is sorted on the base a tile below it. Anything that is
 * complete in a single tile belongs in `scatter` instead, however the sheet
 * happens to stack it.
 *
 * Every tile a biome actually stands on the `structure` layer: the base tile of
 * each 2-tall plant, every single-tile scatter prop, and both halves of the
 * boulder's bottom row, plus the entrance's sign board. The canopy/top tiles
 * live on `structure props`, which
 * is not a collision layer, so they are deliberately absent.
 */
function solidPropsFor({ vegetation, scatter }) {
    return [...vegetation.map(([, base]) => base), ...scatter, ...BOULDER.bottom, SIGN];
}

const BIOMES = {
    forest: {
        seed: 0x5eed_f0,
        dir: "forest_",
        prefix: "forest",
        backgroundcolor: "#4a7c3f",
        // Fraction of the map that is water, and how blobby it is. Lower
        // `scale` = larger, smoother bodies.
        water: { coverage: 0.14, scale: 26 },
        // Lattice spacing of the grove field — roughly the width of a stand of
        // trees, in tiles.
        groveScale: 34,
        // Number of wandering trails stamped across the map.
        trails: 6,
        // Chance per free tile. Vegetation is the biome's signature, so the
        // forest is dense, the desert sparse.
        density: { vegetation: 0.085, rock: 0.012, deco: 0.06, boulder: 0.0006 },
        vegetation: [
            [13, 25],
            [14, 26],
            [18, 30],
        ],
        // 37 and 49 are two *separate* single-tile bushes that happen to sit one
        // above the other in the sheet — not a canopy over its trunk. Pairing
        // them stacked one bush on top of another and, because the upper tile
        // landed on `structure props`, left it neither solid nor sorted on its
        // own base.
        scatter: [40, 52, 41, 53, 42, 54, 37, 49],
    },
    desert: {
        seed: 0x5eed_de,
        dir: "desert_",
        prefix: "desert",
        backgroundcolor: "#d9c06a",
        // Oases: a handful of large, distinct pools rather than a rash of
        // puddles, so the lattice is coarse and the coverage low.
        water: { coverage: 0.03, scale: 42 },
        // Cacti bunch tightly around the wet spots they grow in.
        groveScale: 22,
        // The most travelled biome — caravan routes criss-cross it.
        trails: 8,
        density: { vegetation: 0.028, rock: 0.018, deco: 0.05, boulder: 0.0016 },
        vegetation: [
            [13, 25],
            [14, 26],
            [15, 27],
        ],
        // Plus the bleached bones in the desert sheet's spare slot.
        scatter: [40, 52, 41, 53, 42, 54, 30],
    },
    tundra: {
        seed: 0x5eed_7a,
        dir: "tundra_",
        prefix: "tundra",
        backgroundcolor: "#e8eef2",
        // Frozen lakes: broad and flat.
        water: { coverage: 0.17, scale: 30 },
        // Conifers grow in thick belts with bare snowfield between them.
        groveScale: 44,
        // The least travelled biome.
        trails: 4,
        density: { vegetation: 0.05, rock: 0.018, deco: 0.045, boulder: 0.001 },
        vegetation: [
            [13, 25],
            [14, 26],
        ],
        // Rocks plus the two single-tile ice shards. (68,69/80,81 is one 2x2
        // crystal, deliberately unused — it is not a pair of singles.)
        scatter: [40, 52, 41, 53, 42, 54, 70, 82],
    },
};

// ── rng + noise ───────────────────────────────────────────────────────────────

/** mulberry32 — small, fast, and seedable, so runs are reproducible. */
function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const lerp = (a, b, t) => a + (b - a) * t;
// Smoothstep, so the interpolated lattice reads as rolling blobs rather than
// diamonds.
const fade = (t) => t * t * (3 - 2 * t);

/**
 * One octave of value noise: sample a coarse random lattice and interpolate it
 * bilinearly, smoothstepped so the result reads as rolling blobs rather than
 * diamonds.
 */
function octave(random, w, h, cell) {
    const gw = Math.ceil(w / cell) + 2;
    const gh = Math.ceil(h / cell) + 2;
    const lattice = Array.from({ length: gw * gh }, random);
    return (x, y) => {
        const gx = x / cell;
        const gy = y / cell;
        const x0 = Math.floor(gx);
        const y0 = Math.floor(gy);
        const tx = fade(gx - x0);
        const ty = fade(gy - y0);
        const at = (cx, cy) => lattice[cy * gw + cx];
        return lerp(
            lerp(at(x0, y0), at(x0 + 1, y0), tx),
            lerp(at(x0, y0 + 1), at(x0 + 1, y0 + 1), tx),
            ty
        );
    };
}

/**
 * Fractal value noise: several octaves of `octave` at doubling frequency and
 * halving amplitude, normalised back to 0..1.
 *
 * The octaves matter. A single octave of bilinear value noise has contours that
 * line up with its own lattice, which showed up in the first pass of these maps
 * as lake shores running dead straight for twenty tiles at a stretch. Adding
 * detail octaves breaks that alignment up, at no meaningful cost — the field is
 * sampled once per corner.
 */
function valueNoise(random, w, h, cell, octaves = 3) {
    const layers = [];
    let spacing = cell;
    let amplitude = 1;
    let total = 0;

    for (let o = 0; o < octaves; o++) {
        layers.push({ sample: octave(random, w, h, spacing), amplitude });
        total += amplitude;
        // Never go below a 3-tile lattice: finer than that is pixel noise, and
        // it only makes the coastline jagged enough to need heavy smoothing.
        spacing = Math.max(3, Math.round(spacing / 2));
        amplitude /= 2;
    }

    return (x, y) =>
        layers.reduce((sum, layer) => sum + layer.sample(x, y) * layer.amplitude, 0) / total;
}

// ── corner grids ──────────────────────────────────────────────────────────────

const CW = WIDTH + 1;
const CH = HEIGHT + 1;
const cornerAt = (grid, x, y) => grid[y * CW + x];

/**
 * The pack has no tile for a checkerboard corner pair (masks 6 and 9), so any
 * tile with only its two diagonals set is smoothed away by clearing one corner.
 * Repeats until the grid is clean — clearing a corner can create a new diagonal
 * in a neighbouring tile.
 */
function removeDiagonals(grid) {
    for (let pass = 0; pass < 12; pass++) {
        let changed = false;
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const nw = cornerAt(grid, x, y);
                const ne = cornerAt(grid, x + 1, y);
                const sw = cornerAt(grid, x, y + 1);
                const se = cornerAt(grid, x + 1, y + 1);
                if (nw && se && !ne && !sw) {
                    grid[(y + 1) * CW + x + 1] = 0;
                    changed = true;
                } else if (ne && sw && !nw && !se) {
                    grid[(y + 1) * CW + x] = 0;
                    changed = true;
                }
            }
        }
        if (!changed) return;
    }
}

/** Reads the 4 corners around tile (x, y) into a mask. */
function maskAt(grid, x, y) {
    return (
        (cornerAt(grid, x, y) ? NW : 0) |
        (cornerAt(grid, x + 1, y) ? NE : 0) |
        (cornerAt(grid, x, y + 1) ? SW : 0) |
        (cornerAt(grid, x + 1, y + 1) ? SE : 0)
    );
}

/**
 * The block of the map the entrance owns — the fenced pocket, the gateway and
 * the clearing below it, plus a few tiles of slack. Kept free of water, so the
 * gateway and the start always stand on land. Works for tile and corner
 * coordinates alike; the one-corner difference falls inside the slack.
 */
const inEntrance = (x, y) =>
    x <= ENTRANCE.fenceEndX + 4 && y <= ENTRANCE.start.y + ENTRANCE.clearing + 2;

/**
 * Water corner grid. The noise field is thresholded at whatever level yields the
 * requested coverage (so `coverage` means the same thing whatever the noise does
 * on a given seed), then the map edge is forced to land so the player can never
 * spawn or be pushed into water at the boundary. The entrance block is kept dry
 * too, so the gateway and the start always stand on land.
 */
function buildWaterCorners(random, { coverage, scale }) {
    const noise = valueNoise(random, CW, CH, scale);
    const field = new Float32Array(CW * CH);
    for (let y = 0; y < CH; y++) {
        for (let x = 0; x < CW; x++) field[y * CW + x] = noise(x, y);
    }

    const threshold = [...field].sort((a, b) => b - a)[Math.floor(field.length * coverage)];

    const grid = new Uint8Array(CW * CH);
    const MARGIN = 8;
    for (let y = 0; y < CH; y++) {
        for (let x = 0; x < CW; x++) {
            const edge = x < MARGIN || y < MARGIN || x >= CW - MARGIN || y >= CH - MARGIN;
            const dry = edge || inEntrance(x, y);
            grid[y * CW + x] = !dry && field[y * CW + x] >= threshold ? 1 : 0;
        }
    }
    removeDiagonals(grid);
    return grid;
}

/**
 * Trails: a walk with momentum. Each step nudges the heading slightly rather
 * than picking a fresh direction, so a trail sweeps and curves across the map
 * instead of reading as a straight line with jitter (which, stamped in a few
 * directions, looks like a street grid). Corners that would sit on water are
 * dropped rather than routed around — the trail stops at the shoreline, which
 * reads as a ford and is easy to finish by hand in Tiled.
 */
function buildPathCorners(random, water, trails) {
    const grid = new Uint8Array(CW * CH);

    // A corner is off-limits to the path if it, or any corner touching it, is
    // water. Skipping only water corners themselves is not enough: a tile with
    // one path corner and one water corner gets a *partial* path tile, whose
    // non-path half is drawn as plain ground — painting over the shoreline the
    // terrain layer drew underneath and leaving the water with no edge at all.
    // Keeping one corner of clearance means a path tile never shares a tile
    // with water.
    const nearWater = new Uint8Array(CW * CH);
    for (let y = 0; y < CH; y++) {
        for (let x = 0; x < CW; x++) {
            if (!water[y * CW + x]) continue;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx < 0 || ny < 0 || nx >= CW || ny >= CH) continue;
                    nearWater[ny * CW + nx] = 1;
                }
            }
        }
    }

    const stamp = (cx, cy, radius) => {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const x = Math.round(cx) + dx;
                const y = Math.round(cy) + dy;
                if (x < 0 || y < 0 || x >= CW || y >= CH) continue;
                if (nearWater[y * CW + x]) continue;
                grid[y * CW + x] = 1;
            }
        }
    };

    // `target`, when given, pulls the heading gently towards a point, so the
    // walk still meanders but is sure to arrive somewhere.
    const walk = (x, y, heading, radius, target) => {
        // Generous cap — the walk normally exits the map long before this.
        for (let s = 0; s < WIDTH * 4; s++) {
            stamp(x, y, radius);
            // Small per-step turn: enough to meander over a few hundred tiles,
            // not enough to double back on itself.
            heading += (random() - 0.5) * 0.45;
            if (target) {
                if (Math.hypot(target.x - x, target.y - y) < 2) break;
                const bearing = Math.atan2(target.y - y, target.x - x);
                // Signed difference wrapped to -π..π, eased in a tenth a step.
                heading +=
                    Math.atan2(Math.sin(bearing - heading), Math.cos(bearing - heading)) * 0.1;
            }
            x += Math.cos(heading);
            y += Math.sin(heading);
            if (x < -2 || y < -2 || x > CW + 2 || y > CH + 2) break;
        }
    };

    for (let t = 0; t < trails; t++) {
        // Enter from one of the four edges, heading roughly inward with up to
        // ±45° of slant, so the trails fan out instead of stacking up.
        const edge = t % 4;
        const x = edge === 0 ? 0 : edge === 2 ? CW - 1 : random() * CW;
        const y = edge === 1 ? 0 : edge === 3 ? CH - 1 : random() * CH;
        const heading = (edge * Math.PI) / 2 + (random() - 0.5) * (Math.PI / 2);

        // Mostly single-track; an occasional wider route reads as a main road.
        const radius = random() < 0.25 ? 2 : 1;

        walk(x, y, heading, radius);
    }

    // The entrance lays its own road, so wipe whatever the trails left behind
    // the fence first — a trail wandering under it or through the pocket would
    // read as a gap in both. Trails crossing the clearing are left be.
    const { gateX, gateY, opening, fenceEndX, start } = ENTRANCE;
    for (let y = 0; y <= gateY + 1; y++) {
        for (let x = 0; x <= fenceEndX + 1; x++) grid[y * CW + x] = 0;
    }

    // The road: straight in from the top edge, through the gateway's opening,
    // to just past the start. Its corners span the opening exactly, so the
    // full path tiles sit between the posts and the grass edges under them.
    for (let y = 0; y <= start.y + 1; y++) {
        for (let x = gateX + 1; x <= gateX + 1 + opening; x++) grid[y * CW + x] = 1;
    }
    // …and on from there as one more trail, winding to the middle of the map
    // so the road always leads somewhere.
    walk(gateX + 1 + opening / 2, start.y, Math.PI / 4, 1, { x: CW / 2, y: CH / 2 });

    removeDiagonals(grid);
    return grid;
}

// ── entrance assembly ─────────────────────────────────────────────────────────

/**
 * Fence tiles share the `structure` layers with the resource props, and a layer
 * is serialised against a single firstgid (the resource sheet's). Shifting a
 * fence id by the gap between the two sheets' firstgids makes that one offset
 * land it on the right gid.
 */
const fence = (id) => id + (FENCE_GID - RESOURCE_GID);

/**
 * Stamps the gateway, the fence and the sign, reserves the clearing, and fills
 * the pocket behind the fence with trees. Runs before any random prop is
 * placed, so everything it reserves stays clear. The road itself is laid with
 * the other paths in `buildPathCorners`.
 */
function buildEntrance(biome, random, { structure, structureProps, taken, free }) {
    const { gateX, gateY, opening, fenceEndX, start, clearing, pocketDensity } = ENTRANCE;
    const rightPost = gateX + opening + 1;
    const at = (x, y) => y * WIDTH + x;
    const put = (layer, x, y, id) => {
        layer[at(x, y)] = id;
        taken[at(x, y)] = 1;
    };

    // Gateway: the beam spans every column, widened by repeating its middle
    // piece; the posts only stand at the two ends.
    for (let x = gateX; x <= rightPost; x++) {
        const piece = x === gateX ? 0 : x === rightPost ? 2 : 1;
        put(structureProps, x, gateY - 2, fence(GATE.sliver[piece]));
        put(structureProps, x, gateY - 1, fence(GATE.beam[piece]));
        // Keep props out of the opening too.
        taken[at(x, gateY)] = 1;
    }
    put(structure, gateX, gateY, fence(GATE.posts[0]));
    put(structure, rightPost, gateY, fence(GATE.posts[1]));

    // The fence: west from the gate off the map's edge, east to the corner,
    // then north off the top edge — closing off the strip behind it. The runs
    // butt straight up against the posts.
    for (let x = 0; x < fenceEndX; x++) {
        if (x < gateX || x > rightPost) put(structure, x, gateY, fence(FENCE_RUN));
    }
    put(structure, fenceEndX, gateY, fence(FENCE_CORNER));
    for (let y = 0; y < gateY; y++) put(structure, fenceEndX, y, fence(FENCE_VERTICAL));

    // The clearing the player arrives in. Reserved, not placed: it just keeps
    // the random props off it.
    for (let y = gateY + 1; y <= start.y + clearing; y++) {
        for (let x = 0; x <= start.x + clearing; x++) {
            if (Math.hypot(x - start.x, y - start.y) <= clearing) taken[at(x, y)] = 1;
        }
    }

    // A sign board beside the road, just inside the gate.
    put(structure, rightPost + 1, gateY + 2, SIGN);

    // The strip behind the fence, thick with trees either side of the road.
    for (let y = 1; y < gateY; y++) {
        for (let x = 0; x < fenceEndX; x++) {
            if (random() >= pocketDensity) continue;
            if (!free(x, y) || !free(x, y - 1)) continue;
            const [canopy, base] = biome.vegetation[Math.floor(random() * biome.vegetation.length)];
            put(structure, x, y, base);
            put(structureProps, x, y - 1, canopy);
        }
    }
}

// ── map assembly ──────────────────────────────────────────────────────────────

function generate(name, biome) {
    const random = rng(biome.seed);

    const water = buildWaterCorners(random, biome.water);
    const path = buildPathCorners(random, water, biome.trails);

    const terrain = new Array(WIDTH * HEIGHT).fill(0);
    const terrainProps = new Array(WIDTH * HEIGHT).fill(0);
    const paths = new Array(WIDTH * HEIGHT).fill(0);
    const structure = new Array(WIDTH * HEIGHT).fill(0);
    const structureProps = new Array(WIDTH * HEIGHT).fill(0);

    // A tile is "open" when it is entirely dry land with no path on it — that is
    // where props may go.
    const open = new Uint8Array(WIDTH * HEIGHT);

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const i = y * WIDTH + x;
            const waterMask = maskAt(water, x, y);
            const pathMask = maskAt(path, x, y);
            // `removeDiagonals` should have made masks 6 and 9 impossible. If
            // one survives, the lookup returns undefined and we would write a
            // `null` into the tile data, which Tiled refuses to open — so fail
            // here, where the cause is obvious.
            if (WATER_BY_MASK[waterMask] === undefined)
                throw new Error(`${name}: no water tile for corner mask ${waterMask} at ${x},${y}`);
            if (PATH_BY_MASK[pathMask] === undefined)
                throw new Error(`${name}: no path tile for corner mask ${pathMask} at ${x},${y}`);
            terrain[i] = WATER_BY_MASK[waterMask];
            // Where the path is solid, sometimes swap the plain tile for one of
            // the flecked variants, the way the town's dirt is detailed. Only
            // the full-path mask: the edge tiles carry their own grass border
            // and have no flecked counterpart.
            paths[i] =
                pathMask === 15 && random() < PATH_DECO_CHANCE
                    ? PATH_DECO[Math.floor(random() * PATH_DECO.length)]
                    : PATH_BY_MASK[pathMask];
            open[i] = waterMask === 0 && pathMask === 0 ? 1 : 0;
        }
    }

    const { vegetation, rock, deco, boulder } = biome.density;

    // Vegetation clusters rather than scattering evenly: a second, coarser
    // noise field modulates the per-tile odds, so the map gets groves and
    // clearings instead of uniform static. Multiplier runs 0.1x-1.9x, which
    // preserves the biome's average density while varying it locally.
    const grove = valueNoise(random, WIDTH, HEIGHT, biome.groveScale);

    // Ground decoration first: it is purely visual and sits under everything.
    for (let i = 0; i < open.length; i++) {
        if (open[i] && random() < deco) {
            terrainProps[i] = GROUND_DECO[Math.floor(random() * GROUND_DECO.length)];
        }
    }

    // `taken` keeps props from overlapping each other; a tall prop reserves the
    // tile above its base as well.
    const taken = new Uint8Array(WIDTH * HEIGHT);
    const free = (x, y) =>
        x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT && open[y * WIDTH + x] && !taken[y * WIDTH + x];

    buildEntrance(biome, random, { structure, structureProps, taken, free });

    // Boulders are 2x2 landmarks, placed first so they win the space.
    for (let y = 1; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH - 1; x++) {
            if (random() >= boulder) continue;
            if (!free(x, y) || !free(x + 1, y) || !free(x, y - 1) || !free(x + 1, y - 1)) continue;
            structure[y * WIDTH + x] = BOULDER.bottom[0];
            structure[y * WIDTH + x + 1] = BOULDER.bottom[1];
            structureProps[(y - 1) * WIDTH + x] = BOULDER.top[0];
            structureProps[(y - 1) * WIDTH + x + 1] = BOULDER.top[1];
            for (const [tx, ty] of [
                [x, y],
                [x + 1, y],
                [x, y - 1],
                [x + 1, y - 1],
            ]) {
                taken[ty * WIDTH + tx] = 1;
            }
        }
    }

    // Vegetation: base on `structure`, canopy on `structure props` so it draws
    // over anything standing behind it.
    for (let y = 1; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (random() >= vegetation * (0.1 + 1.8 * grove(x, y))) continue;
            if (!free(x, y) || !free(x, y - 1)) continue;
            const [canopy, base] = biome.vegetation[Math.floor(random() * biome.vegetation.length)];
            structure[y * WIDTH + x] = base;
            structureProps[(y - 1) * WIDTH + x] = canopy;
            taken[y * WIDTH + x] = 1;
            taken[(y - 1) * WIDTH + x] = 1;
        }
    }

    // Single-tile rocks and shards fill the gaps left over.
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (random() >= rock) continue;
            if (!free(x, y)) continue;
            structure[y * WIDTH + x] = biome.scatter[Math.floor(random() * biome.scatter.length)];
            taken[y * WIDTH + x] = 1;
        }
    }

    return { terrain, terrainProps, paths, structure, structureProps };
}

// ── .tmj serialisation ────────────────────────────────────────────────────────

// Relative to public/graphics/tilesets/biomes/, so the images Tiled renders are
// the same files Vite serves to the game.
const PUBLIC = "../fantasy";

/**
 * Tiled writes tile properties as a sparse `tiles` array keyed by local id.
 * Takes the ids carrying each boolean property and merges them, so a tile in
 * several sets (full water both collides and is water) gets one entry.
 */
function tileProperties(byName, ints = {}) {
    const tiles = new Map();
    const add = (id, property) => {
        if (!tiles.has(id)) tiles.set(id, []);
        tiles.get(id).push(property);
    };
    for (const [name, ids] of Object.entries(byName)) {
        for (const id of ids) add(id, { name, type: "bool", value: true });
    }
    // Integer properties, as { name: { id: value } }.
    for (const [name, values] of Object.entries(ints)) {
        for (const [id, value] of Object.entries(values)) {
            add(Number(id), { name, type: "int", value });
        }
    }
    return [...tiles].sort(([a], [b]) => a - b).map(([id, properties]) => ({ id, properties }));
}

/**
 * The gateway's fence tiles that stop the player: the posts and every fence
 * run. The beam overhead is on `structure props` and is walked under.
 */
const FENCE_SOLID = [...GATE.posts, FENCE_RUN, FENCE_VERTICAL, FENCE_CORNER];

/**
 * `sortBase` on a `structure props` tile: how many tiles below it the prop
 * stands, for BiomeScene's per-tile depth sorting. A canopy or boulder top is
 * one tile above its base, which the game assumes when the property is absent
 * — as it is for the gateway's beam, one above its posts. Only the sliver over
 * the beam needs saying: it is two above.
 */
const GATE_SORT_BASE = Object.fromEntries(GATE.sliver.map((id) => [id, 2]));

function tilesets(biome) {
    const solidProps = solidPropsFor(biome);

    return [
        {
            columns: 22,
            firstgid: 1,
            image: `${PUBLIC}/${biome.dir}/${biome.prefix}_.png`,
            imageheight: 144,
            imagewidth: 352,
            margin: 0,
            name: `${biome.prefix}_`,
            spacing: 0,
            tilecount: 198,
            tileheight: 16,
            tiles: tileProperties({ collides: SOLID_TERRAIN, water: WATER_TERRAIN }),
            tilewidth: 16,
        },
        {
            columns: 8,
            firstgid: 199,
            image: `${PUBLIC}/${biome.dir}/${biome.prefix}Path_.png`,
            imageheight: 80,
            imagewidth: 128,
            margin: 0,
            name: `${biome.prefix}Path_`,
            spacing: 0,
            tilecount: 40,
            tileheight: 16,
            tilewidth: 16,
        },
        {
            columns: 12,
            firstgid: 239,
            image: `${PUBLIC}/${biome.dir}/${biome.prefix}_ [resources].png`,
            imageheight: 160,
            imagewidth: 192,
            margin: 0,
            name: `${biome.prefix}_ [resources]`,
            spacing: 0,
            tilecount: 120,
            tileheight: 16,
            tiles: tileProperties({ collides: solidProps }),
            tilewidth: 16,
        },
        {
            columns: 15,
            firstgid: FENCE_GID,
            image: `${PUBLIC}/${biome.dir}/${biome.prefix}_ [fencesAndWalls].png`,
            imageheight: 192,
            imagewidth: 240,
            margin: 0,
            name: `${biome.prefix}_ [fencesAndWalls]`,
            spacing: 0,
            tilecount: 180,
            tileheight: 16,
            tiles: tileProperties({ collides: FENCE_SOLID }, { sortBase: GATE_SORT_BASE }),
            tilewidth: 16,
        },
    ];
}

const TERRAIN_GID = 1;
const PATH_GID = 199;
const RESOURCE_GID = 239;
const FENCE_GID = 359;

const offset = (data, firstgid) => data.map((id) => (id === 0 ? 0 : id + firstgid));

function tileLayer(id, name, data, firstgid) {
    return {
        data: offset(data, firstgid),
        height: HEIGHT,
        id,
        name,
        opacity: 1,
        type: "tilelayer",
        visible: true,
        width: WIDTH,
        x: 0,
        y: 0,
    };
}

function build(name, biome) {
    const layers = generate(name, biome);
    return {
        backgroundcolor: biome.backgroundcolor,
        compressionlevel: -1,
        height: HEIGHT,
        infinite: false,
        layers: [
            tileLayer(1, "terrain", layers.terrain, TERRAIN_GID),
            tileLayer(2, "terrain props", layers.terrainProps, TERRAIN_GID),
            tileLayer(3, "paths", layers.paths, PATH_GID),
            tileLayer(4, "structure", layers.structure, RESOURCE_GID),
            tileLayer(5, "structure props", layers.structureProps, RESOURCE_GID),
            // Left empty on purpose: collision is authored by hand in Tiled once
            // the layout settles, the same way the town map does it. POIs come
            // in a later pass.
            {
                color: "#ff0000",
                draworder: "topdown",
                id: 6,
                name: "collision map",
                objects: [],
                opacity: 1,
                type: "objectgroup",
                visible: true,
                x: 0,
                y: 0,
            },
            // Where the player arrives, read by BiomeScene. A point in map
            // pixels (unscaled), at the centre of the start tile.
            {
                draworder: "topdown",
                id: 7,
                name: "spawn",
                objects: [
                    {
                        height: 0,
                        id: 1,
                        name: "player-start",
                        point: true,
                        rotation: 0,
                        type: "",
                        visible: true,
                        width: 0,
                        x: (ENTRANCE.start.x + 0.5) * TILE,
                        y: (ENTRANCE.start.y + 0.5) * TILE,
                    },
                ],
                opacity: 1,
                type: "objectgroup",
                visible: true,
                x: 0,
                y: 0,
            },
            // Interaction areas, read by BiomeScene the way the town reads its
            // own POI layer. `town-exit` covers the gateway's opening, from the
            // map's top edge down through the posts' row.
            {
                draworder: "topdown",
                id: 8,
                name: "POI",
                objects: [
                    {
                        height: (ENTRANCE.gateY + 1) * TILE,
                        id: 2,
                        name: "town-exit",
                        rotation: 0,
                        type: "",
                        visible: true,
                        width: ENTRANCE.opening * TILE,
                        x: (ENTRANCE.gateX + 1) * TILE,
                        y: 0,
                    },
                ],
                opacity: 1,
                type: "objectgroup",
                visible: true,
                x: 0,
                y: 0,
            },
        ],
        nextlayerid: 9,
        nextobjectid: 3,
        orientation: "orthogonal",
        renderorder: "right-down",
        tiledversion: "1.11.2",
        tileheight: TILE,
        tilesets: tilesets(biome),
        tilewidth: TILE,
        type: "map",
        version: "1.10",
        width: WIDTH,
    };
}

const requested = process.argv.slice(2);
const names = requested.length ? requested : Object.keys(BIOMES);

for (const name of names) {
    const biome = BIOMES[name];
    if (!biome) {
        console.error(
            `unknown biome "${name}" — expected one of ${Object.keys(BIOMES).join(", ")}`
        );
        process.exitCode = 1;
        continue;
    }
    const out = resolve(ROOT, `public/graphics/tilesets/biomes/${name}-map.tmj`);
    mkdirSync(dirname(out), { recursive: true });
    // Compact, not pretty-printed: 5 layers x 90,000 tiles per map, and an
    // indented array would be ~450,000 lines of git diff per biome.
    writeFileSync(out, `${JSON.stringify(build(name, biome))}\n`);
    console.log(`wrote ${out}`);
}
