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
        private canvas?: Canvas
    ) {
        super()
    }

    public AdjustSize(): void {
        if (this.Size.x != Settings.grid.nodeSize) {
            const { Start, End, Index } = Vector2D.NodeArgsFromIndex(this.Index)
            this.Start = Start
            this.End = End
            this.Index = Index
        }
    }

    public Update(deltaTime: number): void {
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
}
