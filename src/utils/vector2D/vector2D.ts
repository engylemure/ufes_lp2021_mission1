export class Vector2D {
    constructor(public x: number, public y: number) {}
    public equals(other: Vector2D): boolean {
        return this.x === other.x && this.y === other.y
    }

    public Update({
        x = this.x,
        y = this.y,
    }: {
        x?: number
        y?: number
    } = {}): Vector2D {
        return new Vector2D(x, y)
    }
}
