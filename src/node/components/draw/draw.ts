import { IComponent } from '@/utils'
import { Node } from '@/node'
import { CanvasLayer } from '@/canvas-layer'

export class NodeDrawComponent implements IComponent {
    public Entity: Node

    public Awake(): void {
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        this.Draw()
    }

    private Draw(): void {
        CanvasLayer.Background.FillRect(
            this.Entity.Start,
            this.Entity.Size,
            this.Entity.color
        )
    }

    public Clear(): void {
        CanvasLayer.Background.ClearRect(this.Entity.Start, this.Entity.Size)
    }
}
