import { Settings } from '@/settings'
import { Entity, Vector2D } from '@/utils'
import { Color } from '@/utils/color'
import { NodeDrawComponent } from './components'

export class Node extends Entity {
    constructor(
        public readonly Start: Vector2D,
        public readonly End: Vector2D,
        public readonly Index: Vector2D,
        public readonly color: Color = Settings.grid.color
    ) {
        super()
    }

    public Awake(): void {
        this.AddComponent(new NodeDrawComponent())

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
            size = Settings.grid.nodeSize,
            offset = Settings.grid.nodeOffset,
        }: { size?: number; offset?: number } = {}
    ): { Start: Vector2D; End: Vector2D; Index: Vector2D } {
        const { x, y } = Index
        const Start = new Vector2D(
            x * (size + offset) + offset,
            y * (size + offset) + offset
        )
        const End = new Vector2D(Start.x + size, Start.y + size)
        return {
            Start,
            End,
            Index,
        }
    }

    public Clear(): void {
        this.GetComponent(NodeDrawComponent).Clear()
    }
}
