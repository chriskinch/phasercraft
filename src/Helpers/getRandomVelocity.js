import random from "lodash/random"

export default function getRandomVelocity(min, max){
    let v = random(min, max);
    let absV = (Math.random() >= 0.5) ? -v : v;
    return absV;
}