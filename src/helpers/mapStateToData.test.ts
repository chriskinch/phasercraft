import { describe, expect, it, vi } from "vitest";
import store from "@store";
import { setLevel } from "@store/gameReducer";
import mapStateToData from "./mapStateToData";

describe("mapStateToData", () => {
    it("skips the initial value when init is false but observes later changes", () => {
        const initialLevel = store.getState().game.level;
        const onLevelChange = vi.fn();
        const unsubscribe = mapStateToData("level.currentLevel", onLevelChange, { init: false });

        try {
            expect(onLevelChange).not.toHaveBeenCalled();

            store.dispatch(
                setLevel({ ...initialLevel, currentLevel: initialLevel.currentLevel + 1 })
            );

            expect(onLevelChange).toHaveBeenCalledOnce();
            expect(onLevelChange).toHaveBeenCalledWith(initialLevel.currentLevel + 1);
        } finally {
            unsubscribe();
            store.dispatch(setLevel(initialLevel));
        }
    });
});
