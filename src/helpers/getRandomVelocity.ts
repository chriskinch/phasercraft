import random from "lodash/random";

export default function getRandomVelocity(min: number, max: number): number {
    let v = random(min, max);
    let absV = (Math.random() >= 0.5) ? -v : v;
    return absV;
}