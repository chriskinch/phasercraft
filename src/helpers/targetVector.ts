interface TargetWithBody {
    body: {
        position: {
            clone(): { subtract(pos: any): { x: number; y: number } };
            x: number;
            y: number;
        };
    };
}

interface VectorResult {
    range: number;
    delta: { x: number; y: number };
}

export default function targetVector(from: TargetWithBody, to: TargetWithBody): VectorResult {
    const d = to.body.position.clone().subtract(from.body.position);
    const range = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.y, 2));
    return { range: range, delta: d };
}