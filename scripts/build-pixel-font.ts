// Builds the in-game bitmap font (#534) into public/graphics/fonts/:
//   bitbybit.png + bitbybit.json   atlas, one frame per colour variant
//   bitbybit-plain.xml             BMFont glyph layout for unoutlined variants
//   bitbybit-outlined.xml          BMFont glyph layout for outlined variants
//
//   npm run fonts:build                       # regenerate the committed files
//   npm run fonts:build -- --preview out.png  # also write a 4× preview of the atlas
//
// File IO only: glyphs live in src/helpers/pixelFont/bitbybitGlyphs.ts, variants
// in src/config/fonts.ts, pixel logic in src/helpers/pixelFont/buildFont.ts.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { encodePng } from "./png.ts";
import { buildPixelFont } from "../src/helpers/pixelFont/buildFont.ts";
import { BITBYBIT_GLYPHS } from "../src/helpers/pixelFont/bitbybitGlyphs.ts";
import { FONT_ATLAS, FONT_VARIANTS } from "../src/config/fonts.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(root, "public/graphics/fonts");

const { image, atlas, xml } = buildPixelFont(BITBYBIT_GLYPHS, FONT_VARIANTS, {
    image: `${FONT_ATLAS}.png`,
});
const png = encodePng(image);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(path.join(OUT_DIR, `${FONT_ATLAS}.png`), png);
writeFileSync(path.join(OUT_DIR, `${FONT_ATLAS}.json`), JSON.stringify(atlas, null, 4) + "\n");
writeFileSync(path.join(OUT_DIR, `${FONT_ATLAS}-plain.xml`), xml.plain);
writeFileSync(path.join(OUT_DIR, `${FONT_ATLAS}-outlined.xml`), xml.outlined);
console.log(
    `wrote ${FONT_ATLAS}.png (${image.width}x${image.height}, ${FONT_VARIANTS.length} variants)`
);

const previewIdx = process.argv.indexOf("--preview");
if (previewIdx > 0 && process.argv[previewIdx + 1]) {
    const out = path.resolve(process.argv[previewIdx + 1]);
    await sharp(png)
        .resize(image.width * 4, image.height * 4, { kernel: "nearest" })
        .flatten({ background: "#3a6ea5" })
        .png()
        .toFile(out);
    console.log(`wrote preview ${out}`);
}
