# Tilemaps

Tiled projects for the town and the three biomes. Open the `.tmj` files directly
in Tiled (1.11+); tileset images are referenced relative to `public/graphics/`,
so what Tiled renders is what Vite serves.

| Map | File | Size | Authored |
| --- | --- | --- | --- |
| Town | `assets/tilesets/town/town-tiled-project.tmj` | 30x30 | by hand |
| Forest | `public/graphics/tilesets/biomes/forest-map.tmj` | 300x300 | generated |
| Desert | `public/graphics/tilesets/biomes/desert-map.tmj` | 300x300 | generated |
| Tundra | `public/graphics/tilesets/biomes/tundra-map.tmj` | 300x300 | generated |

The biome maps live under `public/` rather than here because they are generated
*and* served. At ~1MB each, keeping an `assets/` copy as well would put 3MB of
duplicate data in git for no gain — the generator is the source of truth.

## Regenerating the biome maps

    npm run maps:biomes            # all three
    node scripts/generate-biome-maps.mjs forest

Generation is deterministic — each biome has a fixed seed, so re-running gives
byte-identical output and the committed `.tmj` files stay reviewable. Tune the
`BIOMES` table at the top of `scripts/generate-biome-maps.mjs` (water coverage,
trail count, prop density, which props are solid) and re-run to iterate.

**Hand-edits in Tiled are overwritten by the generator.** Once a biome is being
authored by hand, drop it from the script's `BIOMES` table.

## Layers

The biome maps use the same bottom-to-top ordering as the town:

| Layer | Contents |
| --- | --- |
| `terrain` | ground and water, autotiled; every tile is filled |
| `terrain props` | flat ground detail — pebble clusters, grass tufts |
| `paths` | trail network, autotiled; empty where there is no path |
| `structure` | the base tile of anything standing — tree trunks, rocks, boulders |
| `structure props` | the tile *above* a base — tree canopies, boulder tops |
| `collision map` | empty; authored by hand only if a map ever needs it |

There is no `POI` layer yet — points of interest come in a later pass.

`BiomeScene` gives every tile layer a negative depth, so all of them draw beneath
the player and the enemies (whose depth tracks their y). Canopies therefore draw
over trunks but never over a character: in a top-down fight, seeing who you are
hitting beats the realism of walking behind a tree.

## Collision

Biome collision is **tile-based**, not the hand-drawn object layer the town uses.
The generator writes `collides: true` onto individual tiles in the `.tmj`
tilesets, and `BiomeScene` calls `setCollisionByProperty` and registers one
collider per layer. That stays flat as the map grows, where the town's
one-`collider`-per-object approach is O(objects).

The important constraint: **Arcade collides against the whole tile.** Tiled's
per-tile collision shapes are read only by Matter (`Physics.Matter.TileBody`);
the tilemap component that reads them for Arcade uses them as a boolean and
discards the geometry. So only tiles whose art nearly fills its cell are worth
making solid:

| Tile | Fill | Solid? |
| --- | --- | --- |
| Full water (158) | 100% | yes — exact fit |
| Tree / conifer / bush base | 60-66% | yes — ~2px slack per side |
| Rocks, ore, ice shards, bones | 44-66% | no |
| Cactus base | 43-54% | no — a 10px trunk in a 16px cell |
| Shoreline edge tiles | partial | no — the player can reach the water's edge |

Boulders are the obvious next candidate if these maps need more cover: add tiles
`50` and `51` to a biome's `solidProps`.

## Autotiling

`fantasy_ [version 2.0]` ships `forest_`, `desert_` and `tundra_` tilesets that
are **pixel-identical in layout** — only the palette differs — so one set of tile
indices drives all three biomes.

Each terrain pair is expressed as two blocks: a 3x3 "A island surrounded by B"
and a 2x2 "B hole in A" that supplies the four inner corners. Together they
cover 14 of the 16 corner combinations.

| Sheet | Grid | 3x3 block | 2x2 block | Solid |
| --- | --- | --- | --- | --- |
| `<biome>_.png` | 22x9 | cols 1-3, rows 5-7 | cols 4-5, rows 5-6 | ground 46, water 158 |
| `<biome>Path_.png` | 8x5 | cols 1-3, rows 1-3 | cols 4-5, rows 1-2 | path 28 |

Tiles are picked from a corner grid one larger than the map in each dimension,
with bits `NW=1, NE=2, SW=4, SE=8`. The two diagonal masks (6 and 9) have no
tile in the pack, so the generator smooths them out of the corner grid before
any lookup — see `removeDiagonals`.

Props live in `<biome>_ [resources].png` (12x10). Vegetation is two tiles tall
and the canopy sits 12 indices above its base (e.g. 13 over 25), which is why it
is split across `structure` and `structure props`.

## Loading

`LoadScene` preloads the tileset images but **not** the biome maps: at ~1MB of
JSON each, and with Phaser building a `Tile` object per tile on parse, pulling
all three in at boot delayed the main menu noticeably for a player who might
never leave town. `BiomeScene.preload()` fetches the one map it needs and skips
the fetch when it is already cached, so re-entering a biome is free.

For the same reason the biome maps are excluded from the PWA precache
(`globIgnores` in `vite.config.ts`) and given a `CacheFirst` runtime rule: they
are cached the first time a player visits that biome and offline from then on.
The 30x30 town map stays precached — it is 66KB and the player lands there
immediately.
