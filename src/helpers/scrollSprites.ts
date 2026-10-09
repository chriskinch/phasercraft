// Scroll sprites (#547, spec: docs/specs/abilities-ui.md → Screens).
//
// Pure, engine-free logic for the scroll × level × spell sprites: lift a spell glyph
// from its `atlas-icons` frame, shrink it to ≤ 5 × 5, and compose it onto the 15 × 15
// scroll at 3×. `scripts/build-scroll-icons.ts` does the file IO (decode the icon
// atlas, encode `public/graphics/atlas/scrolls.png` + `.json`); the committed atlas is
// checked against this module by `scrollSprites.test.ts`.
//
// No Phaser, no DOM, no Node built-ins: imported with an explicit `.ts` extension by
// the Node build script (type stripping), so keep it to erasable TypeScript.
import type { SpellType } from "@entities/Spells/AssignSpell";

export type RGB = readonly [number, number, number];
/** A glyph or sprite as rows of cells; `null` is transparent. */
export type PixelGrid = (RGB | null)[][];
export type ScrollLevel = 1 | 2 | 3;

export const SCROLL_LEVELS: readonly ScrollLevel[] = [1, 2, 3];
/** Logical scroll size (cells) and the on-screen pixel size of one cell. */
export const SCROLL_SIZE = 15;
export const SCROLL_SCALE = 3;
export const SCROLL_FRAME = SCROLL_SIZE * SCROLL_SCALE; // 45 px, fits the 56 px slot
export const GLYPH_MAX = 5;

/**
 * The `atlas-icons` frame each spell uses on the HUD. Mirrors `icon_name` in
 * `src/entities/Spells/<Spell>.ts` (cross-checked by the test); the `Record` makes a
 * new SpellType a type error until it gets a scroll glyph.
 */
export const SPELL_ICON_NAMES: Record<SpellType, string> = {
    AimedShot: "icon_0029_aimed-shot",
    BattleStomp: "icon_0027_battle-stomp",
    BloodFurnace: "icon_0036_blood-furnace",
    Charge: "icon_0031_charge",
    Consecration: "icon_0003_decay",
    EarthShield: "icon_0008_ki",
    Enfeeble: "icon_0028_enfeeble",
    Enrage: "icon_0019_fire-wall",
    Faith: "icon_0026_regen",
    Fireball: "icon_0017_fire-ball",
    Focus: "icon_0030_focus",
    Frostbolt: "icon_0012_beam",
    Heal: "icon_0015_heal",
    Invocation: "icon_0014_haste",
    ManaShield: "icon_0011_freeze",
    Multishot: "icon_0004_corpse-explode",
    PowerInfusion: "icon_0009_blind",
    SiphonSoul: "icon_0000_death",
    Smite: "icon_0007_bolt",
    SnareTrap: "icon_0020_shackle",
    Retaliation: "icon_0032_retaliation",
    Whirlwind: "icon_0005_coil",
};

export const SCROLL_SPELLS = Object.keys(SPELL_ICON_NAMES).sort() as SpellType[];

// Original scroll art: top roll and lower roll, each with a curl on its right end,
// page between. Keys index into the level palette; "." is transparent.
//   O outline · h roll highlight · s roll shade · c curl · k curl core
//   P page · p page shade · q page highlight
export const SCROLL_ART: readonly string[] = [
    "..OOOOOOOOOOOO.",
    ".OhhhhhhhhhhOcO",
    ".OssssssssssOkO",
    "..OOOOOOOOOOOO.",
    "..OqppppppppO..",
    "..OqPPPPPPPpO..",
    "..OqPPPPPPPpO..",
    "..OqPPPPPPPPpO.",
    "..OqPPPPPPPPpO.",
    "..OqPPPPPPPPpO.",
    "..OqPPPPPPPPpO.",
    ".OOOOOOOOOOOO..",
    "OhhhhhhhhhhOcO.",
    "OssssssssssOkO.",
    ".OOOOOOOOOOOO..",
];

/** Page rows the glyph (plus its ring) is centred in, and its centre column. */
const PAGE_TOP = 4;
const PAGE_BOTTOM = 10;
const PAGE_CENTRE_X = 7;

type PaletteKey = "O" | "h" | "s" | "c" | "k" | "P" | "p" | "q";

/** Level = scroll colour, a full palette swap: L1 parchment, L2 green, L3 blue. */
export const SCROLL_PALETTES: Record<ScrollLevel, Record<PaletteKey, string>> = {
    1: {
        O: "#4a2a33",
        h: "#f4ead0",
        s: "#c9a978",
        c: "#a87e58",
        k: "#6e4a34",
        P: "#ecdcb4",
        p: "#dcc596",
        q: "#f6efdc",
    },
    2: {
        O: "#2c3a2a",
        h: "#e4f0d4",
        s: "#9fbf80",
        c: "#789e5c",
        k: "#4a6a3a",
        P: "#d2e6b4",
        p: "#b4d090",
        q: "#eef6e2",
    },
    3: {
        O: "#26304d",
        h: "#e2ecf8",
        s: "#94aedb",
        c: "#6f8fc4",
        k: "#43608f",
        P: "#cbdbf2",
        p: "#a9c1e6",
        q: "#eef4fc",
    },
};

export const hexToRgb = (hex: string): RGB => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
];

const rgbKey = (c: RGB): string => c.join(",");

// ---------------------------------------------------------------------------
// Hand touch-ups. Glyphs whose auto-shrunk motif loses contrast on parchment get a
// hand-drawn grid instead (spec open question 6). Keys map to colours; "." is clear.
// Corners stay clear like every generated glyph.

interface GlyphOverride {
    colours: Record<string, string>;
    rows: readonly string[];
}

export const GLYPH_OVERRIDES: Partial<Record<SpellType, GlyphOverride>> = {
    // Decay icon: a pale three-pronged crown on a dark panel. Pale-on-parchment lost
    // it, so give the crown a slate body and keep the pale tips.
    Consecration: {
        colours: { w: "#deeed6", g: "#85959f", d: "#4e4a4e" },
        rows: ["..w..", "w.g.w", "gdgdg", "dgwgd", ".ddd."],
    },
    // Bolt icon: a yellow lightning bolt. The shrink filled it into a block with the
    // orange backdrop; draw the zig-zag with a white edge and orange shadow.
    Smite: {
        colours: { w: "#deeed6", y: "#dad45e", o: "#d27d2c" },
        rows: ["..wy.", ".wyo.", "wyyyy", "..yo.", ".yo.."],
    },
};

export const overrideToGrid = ({ colours, rows }: GlyphOverride): PixelGrid =>
    rows.map((row) => [...row].map((ch) => (ch === "." ? null : hexToRgb(colours[ch]))));

// ---------------------------------------------------------------------------
// Glyph extraction.

export interface RgbaImage {
    width: number;
    height: number;
    /** Row-major RGBA, 4 bytes per pixel. */
    data: Uint8Array;
}

export interface FrameRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Lift the motif from an `atlas-icons` frame. The icons are drawn as 2 × 2 logical
 * pixels on a 16 × 16 grid inside a bordered panel: take the panel interior (logical
 * x 2..w/2-4, y 2..11), drop its most common colour (the background) and the four
 * panel corners, then trim to the bounding box.
 */
export const extractGlyph = (image: RgbaImage, frame: FrameRect): PixelGrid => {
    const x0 = 2;
    const x1 = Math.floor(frame.w / 2) - 4;
    const y0 = 2;
    const y1 = 11;
    const cells: PixelGrid = [];
    const counts = new Map<string, number>();
    for (let ly = y0; ly <= y1; ly++) {
        const row: (RGB | null)[] = [];
        for (let lx = x0; lx <= x1; lx++) {
            const o = ((frame.y + ly * 2) * image.width + frame.x + lx * 2) * 4;
            if (image.data[o + 3] === 0) {
                row.push(null);
                continue;
            }
            const c: RGB = [image.data[o], image.data[o + 1], image.data[o + 2]];
            counts.set(rgbKey(c), (counts.get(rgbKey(c)) ?? 0) + 1);
            row.push(c);
        }
        cells.push(row);
    }
    let background = "";
    let best = -1;
    for (const [key, n] of counts) {
        if (n > best) {
            best = n;
            background = key;
        }
    }
    const h = cells.length;
    const w = cells[0].length;
    for (const [y, x] of [
        [0, 0],
        [0, w - 1],
        [h - 1, 0],
        [h - 1, w - 1],
    ]) {
        cells[y][x] = null;
    }
    const masked = cells.map((row) => row.map((c) => (c && rgbKey(c) !== background ? c : null)));
    return trim(masked);
};

/** Crop a grid to the bounding box of its opaque cells (empty grid → `[]`). */
export const trim = (grid: PixelGrid): PixelGrid => {
    let top = Infinity;
    let bottom = -1;
    let left = Infinity;
    let right = -1;
    grid.forEach((row, y) =>
        row.forEach((c, x) => {
            if (!c) return;
            top = Math.min(top, y);
            bottom = Math.max(bottom, y);
            left = Math.min(left, x);
            right = Math.max(right, x);
        })
    );
    if (bottom < 0) return [];
    return grid.slice(top, bottom + 1).map((row) => row.slice(left, right + 1));
};

/**
 * Shrink to fit `max` × `max`, keeping the aspect ratio. Each target cell covers a
 * block of source cells; it is opaque when at least half the block is, taking the
 * block's most common colour (first seen wins ties).
 */
export const shrinkGlyph = (grid: PixelGrid, max: number = GLYPH_MAX): PixelGrid => {
    const h = grid.length;
    const w = h ? grid[0].length : 0;
    const m = Math.max(h, w);
    if (m <= max) return grid.map((row) => row.slice());
    const th = Math.max(1, Math.round((h * max) / m));
    const tw = Math.max(1, Math.round((w * max) / m));
    const out: PixelGrid = [];
    for (let ty = 0; ty < th; ty++) {
        const row: (RGB | null)[] = [];
        for (let tx = 0; tx < tw; tx++) {
            const ya = Math.floor((ty * h) / th);
            const yb = Math.floor(((ty + 1) * h) / th);
            const xa = Math.floor((tx * w) / tw);
            const xb = Math.floor(((tx + 1) * w) / tw);
            const counts = new Map<string, { c: RGB; n: number }>();
            let total = 0;
            let on = 0;
            for (let y = ya; y < yb; y++) {
                for (let x = xa; x < xb; x++) {
                    total++;
                    const c = grid[y][x];
                    if (!c) continue;
                    on++;
                    const entry = counts.get(rgbKey(c));
                    if (entry) entry.n++;
                    else counts.set(rgbKey(c), { c, n: 1 });
                }
            }
            let pick: RGB | null = null;
            if (on * 2 >= total) {
                let best = 0;
                for (const { c, n } of counts.values()) {
                    if (n > best) {
                        best = n;
                        pick = c;
                    }
                }
            }
            row.push(pick);
        }
        out.push(row);
    }
    return out;
};

/** Shrink, then clear the four corners so the glyph never reads as a square. */
export const prepareGlyph = (grid: PixelGrid, max: number = GLYPH_MAX): PixelGrid => {
    const g = shrinkGlyph(grid, max);
    const h = g.length;
    const w = h ? g[0].length : 0;
    if (h > 2 && w > 2) {
        g[0][0] = null;
        g[0][w - 1] = null;
        g[h - 1][0] = null;
        g[h - 1][w - 1] = null;
    }
    return g;
};

/**
 * The final glyph for a spell: the hand-drawn override when there is one, otherwise
 * the motif lifted from its icon frame; shrunk to ≤ 5 × 5 with corners clear.
 */
export const resolveGlyph = (spell: SpellType, icons: RgbaImage, frame: FrameRect): PixelGrid => {
    const override = GLYPH_OVERRIDES[spell];
    return prepareGlyph(override ? overrideToGrid(override) : extractGlyph(icons, frame));
};

// ---------------------------------------------------------------------------
// Composition.

/** The 15 × 15 scroll cells for a level, with the glyph ringed in the outline colour. */
export const composeScrollCells = (glyph: PixelGrid | null, level: ScrollLevel): PixelGrid => {
    const pal = Object.fromEntries(
        Object.entries(SCROLL_PALETTES[level]).map(([k, v]) => [k, hexToRgb(v)])
    ) as Record<PaletteKey, RGB>;
    const cells: PixelGrid = SCROLL_ART.map((row) =>
        [...row].map((ch) => (ch === "." ? null : pal[ch as PaletteKey]))
    );
    if (!glyph || glyph.length === 0) return cells;
    const h = glyph.length;
    const w = glyph[0].length;
    const ox = PAGE_CENTRE_X - Math.floor(w / 2);
    const oy = PAGE_TOP + Math.floor((PAGE_BOTTOM - PAGE_TOP + 1 - h) / 2);
    const on = (y: number, x: number): boolean =>
        y >= 0 && y < h && x >= 0 && x < w && !!glyph[y][x];
    // Ring: every empty 4-neighbour of a glyph cell, kept inside the page rows.
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (!glyph[y][x]) continue;
            for (const [dx, dy] of [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ]) {
                const Y = oy + y + dy;
                if (!on(y + dy, x + dx) && Y >= PAGE_TOP && Y <= PAGE_BOTTOM)
                    cells[Y][ox + x + dx] = pal.O;
            }
        }
    }
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const c = glyph[y][x];
            if (c) cells[oy + y][ox + x] = c;
        }
    }
    return cells;
};

/** Blit `cells` at `scale` into an RGBA image at (dx, dy). */
export const blitCells = (
    target: RgbaImage,
    cells: PixelGrid,
    dx: number,
    dy: number,
    scale: number
): void => {
    cells.forEach((row, cy) =>
        row.forEach((c, cx) => {
            if (!c) return;
            for (let y = 0; y < scale; y++) {
                for (let x = 0; x < scale; x++) {
                    const o = ((dy + cy * scale + y) * target.width + dx + cx * scale + x) * 4;
                    target.data[o] = c[0];
                    target.data[o + 1] = c[1];
                    target.data[o + 2] = c[2];
                    target.data[o + 3] = 255;
                }
            }
        })
    );
};

// ---------------------------------------------------------------------------
// Atlas: one column per spell (sorted by name), one row per level; 2 px transparent
// gutter between frames so scaled sampling never bleeds a neighbour in.

export const ATLAS_GUTTER = 2;
export const ATLAS_IMAGE = "scrolls.png";

export const scrollFrameKey = (spell: SpellType, level: ScrollLevel): string =>
    `${spell}_l${level}`;

interface AtlasFrame {
    frame: FrameRect;
    rotated: false;
    trimmed: false;
    spriteSourceSize: FrameRect;
    sourceSize: { w: number; h: number };
}

/** Phaser / TexturePacker "JSON hash" atlas. */
export interface ScrollAtlasJson {
    frames: Record<string, AtlasFrame>;
    meta: {
        app: string;
        image: string;
        format: "RGBA8888";
        size: { w: number; h: number };
        scale: "1";
    };
}

export interface ScrollAtlas {
    image: RgbaImage;
    json: ScrollAtlasJson;
}

/**
 * Build the whole scroll atlas from the decoded `atlas-icons` image and a lookup from
 * icon frame name to its rect. Deterministic: same inputs, byte-identical output.
 */
export const buildScrollAtlas = (
    icons: RgbaImage,
    iconFrame: (iconName: string) => FrameRect
): ScrollAtlas => {
    const step = SCROLL_FRAME + ATLAS_GUTTER;
    const width = SCROLL_SPELLS.length * step - ATLAS_GUTTER;
    const height = SCROLL_LEVELS.length * step - ATLAS_GUTTER;
    const image: RgbaImage = { width, height, data: new Uint8Array(width * height * 4) };
    const frames: Record<string, AtlasFrame> = {};
    SCROLL_SPELLS.forEach((spell, col) => {
        const glyph = resolveGlyph(spell, icons, iconFrame(SPELL_ICON_NAMES[spell]));
        SCROLL_LEVELS.forEach((level, row) => {
            const x = col * step;
            const y = row * step;
            blitCells(image, composeScrollCells(glyph, level), x, y, SCROLL_SCALE);
            frames[scrollFrameKey(spell, level)] = {
                frame: { x, y, w: SCROLL_FRAME, h: SCROLL_FRAME },
                rotated: false,
                trimmed: false,
                spriteSourceSize: { x: 0, y: 0, w: SCROLL_FRAME, h: SCROLL_FRAME },
                sourceSize: { w: SCROLL_FRAME, h: SCROLL_FRAME },
            };
        });
    });
    return {
        image,
        json: {
            frames,
            meta: {
                app: "scripts/build-scroll-icons.ts",
                image: ATLAS_IMAGE,
                format: "RGBA8888",
                size: { w: width, h: height },
                scale: "1",
            },
        },
    };
};

// ---------------------------------------------------------------------------
// World drop (#385): every dropped scroll shows this one sealed scroll, 16 × 16 at
// one art px per world px like the other loot drops, outlined in the loot pack's
// near-black. Which spell it holds shows once it is in the Scrolls tab.

export const DROP_IMAGE = "scroll-drop.png";
export const DROP_SIZE = 16;

export const DROP_ART: GlyphOverride = {
    colours: {
        O: "#151515", // outline
        W: "#ffeecc", // roll highlight, page edge
        P: "#fef3c0", // page
        r: "#c7b08b", // roll body, page shade
        s: "#9c7c5c", // roll shade, writing
        k: "#6a4529", // curl core
        R: "#b4202a", // wax seal
        d: "#73172d", // seal shade
        o: "#fa6a0a", // seal highlight
    },
    rows: [
        "................",
        ".OOOOOOOOOOOOOO.",
        "OWWWWWWWWWWWWOkO",
        "OrrrrrrrrrrrrOsO",
        ".OOOOOOOOOOOOOO.",
        "..OWPPPPPPPPrO..",
        "..OWPssssssPrO..",
        "..OWPPPPPPPPrO..",
        "..OWPsssssPPrO..",
        "..OWPPPPPPPPrO..",
        "..OWPPPOOOPPrO..",
        ".OOOOOORoROOOOO.",
        "OWWWWWORRdOWWOkO",
        "OrrrrrrOOOrrrOsO",
        ".OOOOOOOOOOOOOO.",
        "................",
    ],
};

/** The world-drop sprite at 1×. Deterministic, like the atlas. */
export const buildScrollDrop = (): RgbaImage => {
    const image: RgbaImage = {
        width: DROP_SIZE,
        height: DROP_SIZE,
        data: new Uint8Array(DROP_SIZE * DROP_SIZE * 4),
    };
    blitCells(image, overrideToGrid(DROP_ART), 0, 0, 1);
    return image;
};
