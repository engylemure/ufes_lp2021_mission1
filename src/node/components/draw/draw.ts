import { IComponent } from '@/utils'
import { Node } from '@/node'
import { CanvasLayer } from '@/canvas-layer'

export class NodeDrawComponent implements IComponent {
    public Entity: Node
    constructor(private Canvas = CanvasLayer.Background) {}

    public Awake(): void {
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        this.Entity.AdjustSize()
        this.Draw()
    }

    private Draw(): void {
        this.Canvas.FillRect(
            this.Entity.Start,
            this.Entity.Size,
            this.Entity.color
        )
    }

    public Clear(): void {
        this.Canvas.ClearRect(this.Entity.Start, this.Entity.Size)
    }
}
