// Builds the scroll × level × spell atlas (#547):
//   public/graphics/atlas/scrolls.png + scrolls.json, frames keyed `<SpellType>_l<level>`.
//
//   npm run scrolls:build                      # regenerate the committed atlas
//   npm run scrolls:build -- --preview out.png # also write a 2× preview sheet
//
// File IO only: all pixel logic lives in src/helpers/scrollSprites.ts (unit-tested).
// The PNG is encoded here with node:zlib rather than sharp so the bytes depend only
// on Node's zlib, not on the installed libpng/libvips build.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import sharp from "sharp";
import {
    ATLAS_IMAGE,
    buildScrollAtlas,
    type FrameRect,
    type RgbaImage,
} from "../src/helpers/scrollSprites.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ATLAS_DIR = path.join(root, "public/graphics/atlas");

interface IconAtlasJson {
    frames: { filename: string; frame: FrameRect }[];
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
});

const crc32 = (buf: Buffer): number => {
    let c = ~0;
    for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
    return ~c >>> 0;
};

const chunk = (type: string, data: Buffer): Buffer => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
};

/** Minimal RGBA8 PNG encoder (filter 0 on every row). */
const encodePng = ({ width, height, data }: RgbaImage): Buffer => {
    const stride = width * 4;
    const raw = Buffer.alloc(height * (stride + 1));
    for (let y = 0; y < height; y++) {
        Buffer.from(data.buffer, data.byteOffset + y * stride, stride).copy(
            raw,
            y * (stride + 1) + 1
        );
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // colour type RGBA
    return Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        chunk("IHDR", ihdr),
        chunk("IDAT", deflateSync(raw, { level: 9 })),
        chunk("IEND", Buffer.alloc(0)),
    ]);
};

const iconsJson = JSON.parse(
    readFileSync(path.join(ATLAS_DIR, "atlas-icons.json"), "utf8")
) as IconAtlasJson;
const decoded = await sharp(path.join(ATLAS_DIR, "atlas-icons.png"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
const icons: RgbaImage = {
    width: decoded.info.width,
    height: decoded.info.height,
    data: new Uint8Array(decoded.data),
};

const iconFrame = (name: string): FrameRect => {
    const entry = iconsJson.frames.find((f) => f.filename === name);
    if (!entry) throw new Error(`atlas-icons has no frame "${name}"`);
    return entry.frame;
};

const { image, json } = buildScrollAtlas(icons, iconFrame);
const png = encodePng(image);
writeFileSync(path.join(ATLAS_DIR, ATLAS_IMAGE), png);
writeFileSync(path.join(ATLAS_DIR, "scrolls.json"), JSON.stringify(json, null, 4) + "\n");
console.log(
    `wrote ${ATLAS_IMAGE} (${image.width}x${image.height}, ${Object.keys(json.frames).length} frames)`
);

const previewIdx = process.argv.indexOf("--preview");
if (previewIdx > 0 && process.argv[previewIdx + 1]) {
    const out = path.resolve(process.argv[previewIdx + 1]);
    await sharp(png)
        .resize(image.width * 2, image.height * 2, { kernel: "nearest" })
        .flatten({ background: "#e6f4f8" })
        .png()
        .toFile(out);
    console.log(`wrote preview ${out}`);
}
