// Minimal PNG encoder shared by the atlas build scripts. Encoded with node:zlib
// rather than sharp so the bytes depend only on Node's zlib, not on the
// installed libpng/libvips build.
import { deflateSync } from "node:zlib";
import type { RgbaImage } from "../src/helpers/scrollSprites.ts";

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
export const encodePng = ({ width, height, data }: RgbaImage): Buffer => {
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
