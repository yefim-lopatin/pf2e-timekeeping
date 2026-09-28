export class Curve {
    constructor(points) {
        this.points = [...points].sort((a, b) => a.x - b.x);
    }

    getValue(x) {
        const n = this.points.length;
        if (n === 0) return 0;
        if (n === 1) return this.points[0].y;

        x = ((x % 1) + 1) % 1;

        for (let i = 0; i < n; i++) {
            const curr = this.points[i];
            const next = this.points[(i + 1) % n];

            if (next.x < curr.x) {
                if (x >= curr.x || x < next.x) {
                    const dx = (next.x + 1) - curr.x;
                    const t = (x >= curr.x ? x : x + 1) - curr.x;
                    return curr.y + (next.y - curr.y) * (t / dx);
                }
            }
            else if (x >= curr.x && x < next.x) {
                const dx = next.x - curr.x;
                const t = (x - curr.x) / dx;
                return curr.y + (next.y - curr.y) * t;
            }
        }

        return this.points[0].y;
    }
}
