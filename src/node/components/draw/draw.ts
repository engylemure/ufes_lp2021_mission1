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
        this.Draw()
    }

    private Draw(): void {
        if (this.Entity.Image) {
            this.Canvas.RenderImage(
                this.Entity.Start,
                this.Entity.Size,
                this.Entity.Image
            )
        } else {
            this.Canvas.FillRect(
                this.Entity.Start,
                this.Entity.Size,
                this.Entity.color
            )
        }
    }

    public Clear(): void {
        this.Canvas.ClearRect(this.Entity.Start, this.Entity.Size)
    }
}
