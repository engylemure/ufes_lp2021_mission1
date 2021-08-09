import { Settings } from '@/settings'
import { Canvas, Entity, Vector2D } from '@/utils'
import { Color } from '@/utils/color'
import { NodeDrawComponent } from './components'

export class Node extends Entity {
    constructor(
        public Start: Vector2D,
        public End: Vector2D,
        public Index: Vector2D,
        public color: Color = Settings.grid.color,
        public Image?: HTMLImageElement,
        private canvas?: Canvas
    ) {
        super()
    }

    public Update(deltaTime: number, beforeUpdate?: () => void): void {
        const { Start, End, Index } = Node.NodeArgsFromIndex(this.Index)
        this.UpdatePosition(Start, End, Index)
        if (beforeUpdate) beforeUpdate()
        super.Update(deltaTime)
    }

    public Awake(): void {
        this.AddComponent(new NodeDrawComponent(this.canvas))
        super.Awake()
    }

    public get Size(): Vector2D {
        return new Vector2D(
            this.End.x - this.Start.x,
            this.End.y - this.Start.y
        )
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

    public Clear(): void {
        this.GetComponent(NodeDrawComponent).Clear()
    }

    public UpdatePosition(
        Start: Vector2D,
        End: Vector2D,
        Index: Vector2D,
        color: Color = this.color,
        shouldClear = true
    ): void {
        if (shouldClear) {
            this.Clear()
        }
        this.Start = Start
        this.End = End
        this.Index = Index
        this.color = color
    }
    public Resize(factor: number): void {
        if (factor <= 1) {
            return
        }
        const resizeBy = 8
        const maxFactor = 16
        for (let i = 0; i < Math.min(factor - 1, maxFactor); i++) {
            const size = this.Size
            const xSize = size.x / resizeBy
            const ySize = size.y / resizeBy
            const xDiff = xSize / resizeBy
            const yDiff = ySize / resizeBy
            const start = this.Start.Update({
                x: xDiff + this.Start.x,
                y: this.Start.y + yDiff,
            })
            const end = this.End.Update({
                x: this.End.x - xDiff,
                y: this.End.y - yDiff,
            })
            this.UpdatePosition(start, end, this.Index)
        }
    }
}
