// Generates placeholder PWA icons from the existing game logo, composited onto
// the brand background (#6e9c48, matching the Phaser canvas / manifest theme).
// One-off helper — NOT wired into the build. Run manually and commit the output:
//
//   node scripts/generate-pwa-icons.mjs
//
// Swap in purpose-drawn square art later by replacing the generated files.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "public/assets/logo.png");
const ICON_DIR = path.join(root, "public/icons");
const BG = { r: 0x6e, g: 0x9c, b: 0x48, alpha: 1 };

// Render the logo scaled to `inner` fraction of a `size`x`size` canvas, centered
// on the brand background. `alpha` controls whether the output keeps transparency
// (apple-touch-icon must be fully opaque with no alpha channel).
async function icon({ size, inner, out, opaque }) {
    const box = Math.round(size * inner);
    const logo = await sharp(SOURCE)
        .resize(box, box, { fit: "contain", background: { ...BG, alpha: 0 } })
        .toBuffer();
    let img = sharp({
        create: { width: size, height: size, channels: 4, background: BG },
    }).composite([{ input: logo, gravity: "centre" }]);
    if (opaque) img = img.flatten({ background: BG }).removeAlpha();
    await img.png().toFile(path.join(ICON_DIR, out));
    console.log(`wrote ${out} (${size}x${size})`);
}

await sharp({ create: { width: 1, height: 1, channels: 4, background: BG } }); // warm sharp
await icon({ size: 192, inner: 0.85, out: "pwa-192.png" });
await icon({ size: 512, inner: 0.85, out: "pwa-512.png" });
// Maskable: keep content inside the ~80% safe zone so launchers can crop a circle.
await icon({ size: 512, inner: 0.6, out: "pwa-maskable-512.png" });
// Apple touch icon lives at the public root and must be opaque (no alpha).
await icon({ size: 180, inner: 0.85, out: "../apple-touch-icon.png", opaque: true });
