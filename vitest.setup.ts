import "@testing-library/jest-dom/vitest";

// jsdom has no canvas implementation, and Phaser probes a 2D context at import
// time (src/device/CanvasFeatures.js). Stub the minimal surface that probe
// touches so modules importing Phaser can be unit tested without the native
// `canvas` package.
const context2DStub = {
    fillStyle: "",
    globalCompositeOperation: "",
    fillRect: () => {},
    drawImage: () => {},
    getImageData: () => ({ data: [0, 0, 0, 0] }),
    putImageData: () => {},
};

// Guard: HTMLCanvasElement only exists in jsdom, not in the node environment
// used by api/ tests.
if (typeof HTMLCanvasElement !== "undefined") {
    HTMLCanvasElement.prototype.getContext = (() =>
        context2DStub) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
