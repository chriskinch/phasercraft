// Generates public/audio/sfx/anvil-clang.wav: the Blacksmith's craft clang
// (#482). The sound is synthesized here rather than downloaded, so the project
// owns it outright (released CC0, see public/audio/sfx/LICENSE.txt).
//
// A crisp anvil ring: a short noisy strike transient over a stack of
// inharmonic partials (struck steel does not ring at whole-number multiples),
// each decaying exponentially, the higher ones faster. Deterministic: the noise
// comes from a seeded PRNG, so re-running reproduces the committed file.
//
// Run: node scripts/generate-anvil-clang.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 22050;
const DURATION_S = 1.0;
const PEAK = 0.8; // ~ -2 dBFS, leaves headroom for the volume setting.

const FUNDAMENTAL_HZ = 1180;
// [frequency ratio, amplitude, decay time constant in seconds]
const PARTIALS = [
    [1, 1, 0.9],
    [2.32, 0.55, 0.5],
    [2.91, 0.4, 0.45],
    [4.1, 0.3, 0.3],
    [5.43, 0.2, 0.22],
    [6.9, 0.12, 0.15],
];
const STRIKE_S = 0.015;
const STRIKE_GAIN = 0.6;

// mulberry32: tiny seeded PRNG so the strike noise is reproducible.
const rng = (() => {
    let a = 0x5eed;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
})();

const length = Math.round(SAMPLE_RATE * DURATION_S);
const samples = new Float64Array(length);
let noisePrev = 0;
for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    for (const [ratio, amp, tau] of PARTIALS) {
        s += amp * Math.exp(-t / tau) * Math.sin(2 * Math.PI * FUNDAMENTAL_HZ * ratio * t);
    }
    if (t < STRIKE_S) {
        // First-difference (high-passed) noise reads as a metallic tick.
        const n = rng() * 2 - 1;
        s += STRIKE_GAIN * (n - noisePrev) * (1 - t / STRIKE_S);
        noisePrev = n;
    }
    // 2 ms attack ramp to avoid a click; 50 ms fade so the tail ends at zero.
    const attack = Math.min(1, t / 0.002);
    const release = Math.min(1, (DURATION_S - t) / 0.05);
    samples[i] = s * attack * release;
}

const max = samples.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const pcm = Buffer.alloc(length * 2);
for (let i = 0; i < length; i++) {
    pcm.writeInt16LE(Math.round((samples[i] / max) * PEAK * 32767), i * 2);
}

// 16-bit mono PCM WAV header.
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(1, 22); // mono
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/audio/sfx/anvil-clang.wav");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.concat([header, pcm]));
console.log(`Wrote ${out}`);
