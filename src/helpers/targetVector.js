export default function targetVector(from, to){
    const d = to.body.position.clone().subtract(from.body.position);
    const range = Math.sqrt(Math.pow(d.x,2) + Math.pow(d.y,2));
    return { range: range, delta: d };
}