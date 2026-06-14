import StatusEffects, { StatusEffect } from "./StatusEffects";
import store from "@store";
import { setStats, updateStats } from "@store/gameReducer";
import type Player from "@entities/Player/Player";

class Boons extends StatusEffects<Player> {
    addEffect(boon: StatusEffect): void {
        super.addEffect(boon);
    }

    calculate(boons: StatusEffect[]): void {
        // Always start from base_stats when calculating boons.
        store.dispatch(setStats(store.getState().game.base_stats));
        // Loop through boons with an iterator to hit nested objects
        boons.forEach((boon) => {
            return store.dispatch(
                updateStats(this.resolveStats(boon.value, store.getState().game.base_stats))
            );
        });
    }
}

export default Boons;
