import { describe, it, expect, vi } from "vitest";
import { setDepthIfChanged } from "./setDepthIfChanged";
import { GameObjects } from "phaser";

function target(depth: number) {
    const object = {
        depth,
        setDepth: vi.fn((value: number) => {
            object.depth = value;
            return object;
        }),
    };
    return object;
}

describe("setDepthIfChanged", () => {
    it("writes a changed depth", () => {
        const object = target(10);

        setDepthIfChanged(object, 12.5);

        expect(object.setDepth).toHaveBeenCalledOnce();
        expect(object.setDepth).toHaveBeenCalledWith(12.5);
        expect(object.depth).toBe(12.5);
    });

    it("skips an unchanged depth, so no depth sort is queued", () => {
        const object = target(12.5);

        setDepthIfChanged(object, 12.5);

        expect(object.setDepth).not.toHaveBeenCalled();
    });

    it("writes once across repeated frames at the same depth", () => {
        const object = target(0);

        setDepthIfChanged(object, 40);
        setDepthIfChanged(object, 40);
        setDepthIfChanged(object, 40);

        expect(object.setDepth).toHaveBeenCalledOnce();
    });
});

// Against Phaser's real Depth component, with the display list stubbed: the
// reason the helper exists is that the setter queues a sort on any write.
describe("setDepthIfChanged with Phaser's Depth component", () => {
    function sprite(depth: number) {
        const object = Object.create(GameObjects.Sprite.prototype) as GameObjects.Sprite & {
            _depth: number;
        };
        const queueDepthSort = vi.fn();
        object.displayList = { queueDepthSort } as unknown as GameObjects.DisplayList;
        object._depth = depth;
        return { object, queueDepthSort };
    }

    it("Phaser queues a depth sort even for an unchanged value", () => {
        const { object, queueDepthSort } = sprite(10);

        object.setDepth(10);

        expect(queueDepthSort).toHaveBeenCalledOnce();
    });

    it("queues nothing when the depth is unchanged", () => {
        const { object, queueDepthSort } = sprite(10);

        setDepthIfChanged(object, 10);

        expect(queueDepthSort).not.toHaveBeenCalled();
        expect(object.depth).toBe(10);
    });

    it("queues a sort and stores the depth when it changes", () => {
        const { object, queueDepthSort } = sprite(10);

        setDepthIfChanged(object, 11);

        expect(queueDepthSort).toHaveBeenCalledOnce();
        expect(object.depth).toBe(11);
    });
});
