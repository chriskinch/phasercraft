// A creature's animation keys, built once per spritesheet key and shared by
// every instance. Enemy and Monster play one of these every frame; composing
// `${key}-${direction}` / `key + "-idle"` there made a new string per enemy
// per frame. Same strings as before; they are registered in
// src/config/animations.ts.

export interface AnimationKeys {
    idle: string;
    death: string;
    // Walking left (velocity x < 0) and right, as movementAnimationHandler picks.
    walkLeft: string;
    walkRight: string;
}

const cache = new Map<string, AnimationKeys>();

export function animationKeys(key: string): AnimationKeys {
    let keys = cache.get(key);
    if (!keys) {
        keys = {
            idle: `${key}-idle`,
            death: `${key}-death`,
            walkLeft: `${key}-left-down`,
            walkRight: `${key}-right-up`,
        };
        cache.set(key, keys);
    }
    return keys;
}
