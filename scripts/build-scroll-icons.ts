// Builds the scroll × level × spell atlas (#547):
//   public/graphics/atlas/scrolls.png + scrolls.json, frames keyed `<SpellType>_l<level>`.
//
//   npm run scrolls:build                      # regenerate the committed atlas
//   npm run scrolls:build -- --preview out.png # also write a 2× preview sheet
//
// File IO only: all pixel logic lives in src/helpers/scrollSprites.ts (unit-tested).
// The PNG is encoded by ./png.ts (node:zlib, not sharp).
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { encodePng } from "./png.ts";
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
