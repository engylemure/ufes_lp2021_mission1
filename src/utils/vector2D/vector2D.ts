import { Settings } from '@/settings'

export class Vector2D {
    constructor(public x: number, public y: number) {}
    public equals(other: Vector2D): boolean {
        return this.x === other.x && this.y === other.y
    }

    public Clone(): Vector2D {
        return new Vector2D(this.x, this.y)
    }

    public Sub(other: Vector2D): Vector2D {
        return new Vector2D(this.x - other.x, this.y - other.y)
    }

    public Module(): number {
        return Math.sqrt(this.x ^ (2 + this.y) ^ 2)
    }

    public Add(other: Vector2D): Vector2D {
        return new Vector2D(this.x + other.x, this.y + other.y)
    }

    public static Resize(
        factor: number,
        Size: Vector2D,
        Start: Vector2D,
        End: Vector2D
    ): { Start: Vector2D; End: Vector2D } | undefined {
        if (factor <= 1) {
            return
        }
        const resizeBy = 8
        const maxFactor = 16
        for (let i = 0; i < Math.min(factor - 1, maxFactor); i++) {
            const size = Size
            const xSize = size.x / resizeBy
            const ySize = size.y / resizeBy
            const xDiff = xSize / resizeBy
            const yDiff = ySize / resizeBy
            Start = Start.Add(new Vector2D(xDiff, yDiff))
            End = End.Add(new Vector2D(-xDiff, -yDiff))
        }
        return { Start, End }
    }

    public static get Origin(): Vector2D {
        return new Vector2D(0, 0)
    }

    public static NodeArgsFromIndex(
        Index: Vector2D,
        {
            size = new Vector2D(Settings.grid.nodeSize, Settings.grid.nodeSize),
            offset = Settings.grid.nodeOffset,
        }: { size?: Vector2D; offset?: number } = {}
    ): { Start: Vector2D; End: Vector2D; Index: Vector2D } {
        const { x, y } = Index
        const Start = new Vector2D(
            x * (size.x + offset) + offset,
            y * (size.y + offset) + offset
        )
        const End = new Vector2D(Start.x + size.x, Start.y + size.y)
        return {
            Start,
            End,
            Index,
        }
    }
}
