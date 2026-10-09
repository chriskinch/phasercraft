// Bakes the player class spritesheets and their UI portraits from the KingBell
// "50 Characters" pack in assets/source:
//   public/graphics/spritesheets/player/<class>.gif   — in-game sheet
//   public/UI/player/<class>.gif                      — portrait shown by CharacterCard et al.
//
//   npm run players:build
//
// Source sheets are 176×2688 — an 11 × 112 grid of 16×24 front-facing frames,
// identical in every sheet of the pack. Row meanings come from the pack's
// __Anims_Order_List_Names_and_License.txt (1-indexed there, 0-indexed here).
//
// Output keeps the 24×32 cell the old art used, so Hero's bounds — and therefore
// Player.setCollisionBox() — are unchanged. Rows are ordered to match the frame
// ranges in src/entities/Player/Player.ts: walk-right, walk-left, idle, death.
//
// The pack has no side or back views, so walk-left is walk-right mirrored; the
// per-class weapon rows put the weapon on one side, which is what makes the
// mirror read as a change of facing.
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp, { type OverlayOptions } from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACK = path.join(ROOT, "assets/source/50_Characters_KingBell");
const SHEET_DIR = path.join(ROOT, "public/graphics/spritesheets/player");
const PORTRAIT_DIR = path.join(ROOT, "public/UI/player");

/** Source frame size in the pack's grid. */
const SRC_W = 16;
const SRC_H = 24;

/** Output cell size — unchanged from the art this replaces. */
const CELL_W = 24;
const CELL_H = 32;
const FRAMES = 4; // every row this script uses has 4 frames

/** `die normal`, shared by every class. */
const DEATH_ROW = 3;

/** The pack's second set, on the same 11 × 112 grid as the first. */
const SET_2 = "__SET 2 50 Enemies and Rivals";

/** Portraits are the idle frame at 4×, cropped to the dimensions the UI expects. */
const PORTRAIT_W = 60;
const PORTRAIT_H = 90;
const PORTRAIT_SCALE = 4;

interface ClassSprite {
    /** Output basename, matching the texture key LoadScene registers. */
    name: string;
    /** Source sheet in the pack. */
    sheet: string;
    /** Row to use for idle (and the portrait). */
    idleRow: number;
    /** Row to use for walking; mirrored for the left-facing row. */
    walkRow: number;
}

// Weapon rows give each class a silhouette of its own: 91/97 sword + shield,
// 93/99 staff + rune, 94/100 wand + rune, 95/101 tall bow. The Occultist uses
// the plain idle/run rows (0/1) — an empty-handed hooded caster.
const SPRITES: ClassSprite[] = [
    // "Chamption" is the pack's own spelling, not a typo here.
    { name: "warrior", sheet: "2_Chamption_B.png", idleRow: 91, walkRow: 97 },
    { name: "cleric", sheet: "8_Magician_B.png", idleRow: 93, walkRow: 99 },
    { name: "mage", sheet: "12_Sages_B.png", idleRow: 94, walkRow: 100 },
    { name: "occultist", sheet: `${SET_2}/12_Sage_D.png`, idleRow: 0, walkRow: 1 },
    { name: "ranger", sheet: "15_Pirates_A.png", idleRow: 95, walkRow: 101 },
    // Not a playable class: the base texture Hero is constructed with, so it
    // has to match or the player shows the old art for a frame on spawn.
    { name: "noob", sheet: "18_Scouts_B.png", idleRow: 0, walkRow: 1 },
];

/** One 16×24 frame of `sheet`, as a raw PNG buffer. */
async function frame(sheet: string, row: number, col: number): Promise<Buffer> {
    return sharp(path.join(PACK, sheet))
        .extract({ left: col * SRC_W, top: row * SRC_H, width: SRC_W, height: SRC_H })
        .png()
        .toBuffer();
}

/**
 * Lays the pack's frames into the 4 × 4 grid of 24×32 cells the game expects.
 * Art is centred horizontally and bottom-aligned, keeping the feet on the floor
 * of the cell where the collision box sits.
 */
async function buildSheet(sprite: ClassSprite): Promise<Buffer> {
    const dx = (CELL_W - SRC_W) / 2;
    const dy = CELL_H - SRC_H;
    const rows = [
        { row: sprite.walkRow, flop: false }, // player-right-up
        { row: sprite.walkRow, flop: true }, // player-left-down
        { row: sprite.idleRow, flop: false }, // player-idle
        { row: DEATH_ROW, flop: false }, // player-death
    ];

    const layers: OverlayOptions[] = [];
    for (const [r, { row, flop }] of rows.entries()) {
        for (let c = 0; c < FRAMES; c++) {
            let cell = sharp(await frame(sprite.sheet, row, c));
            if (flop) cell = cell.flop();
            layers.push({
                input: await cell.png().toBuffer(),
                left: c * CELL_W + dx,
                top: r * CELL_H + dy,
            });
        }
    }

    return sharp({
        create: {
            width: FRAMES * CELL_W,
            height: rows.length * CELL_H,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    })
        .composite(layers)
        .gif()
        .toBuffer();
}

/** The idle pose, scaled up and cropped to the portrait size the UI hardcodes. */
async function buildPortrait(sprite: ClassSprite): Promise<Buffer> {
    const scaled = sharp(await frame(sprite.sheet, sprite.idleRow, 0)).resize(
        SRC_W * PORTRAIT_SCALE,
        SRC_H * PORTRAIT_SCALE,
        { kernel: "nearest" }
    );
    return scaled
        .extract({
            left: Math.floor((SRC_W * PORTRAIT_SCALE - PORTRAIT_W) / 2),
            top: Math.floor((SRC_H * PORTRAIT_SCALE - PORTRAIT_H) / 2),
            width: PORTRAIT_W,
            height: PORTRAIT_H,
        })
        .gif()
        .toBuffer();
}

for (const sprite of SPRITES) {
    writeFileSync(path.join(SHEET_DIR, `${sprite.name}.gif`), await buildSheet(sprite));
    console.log(
        `sheet    ${sprite.name}.gif  ← ${sprite.sheet} rows ${sprite.walkRow}/${sprite.idleRow}/${DEATH_ROW}`
    );

    // `noob` is the in-game base texture only; the UI has no portrait for it.
    if (sprite.name === "noob") continue;
    writeFileSync(path.join(PORTRAIT_DIR, `${sprite.name}.gif`), await buildPortrait(sprite));
    console.log(`portrait ${sprite.name}.gif`);
}
