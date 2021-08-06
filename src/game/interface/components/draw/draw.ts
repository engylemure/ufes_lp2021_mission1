import { IComponent, Vector2D } from '@/utils'
import { Interface } from '@/game/interface'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'

export class InterfaceDrawComponent implements IComponent {
    public Entity: Interface

    public Awake(): void {
        CanvasLayer.Interface.Context.font = '30px Arial'
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        this.Draw()
    }

    private Clear(): void {
        const { nodeOffset: offset, nodeSize: size, dimension } = Settings.grid
        const dimSize = dimension * (size + offset) + offset
        CanvasLayer.Interface.ClearRect(
            Vector2D.Origin,
            new Vector2D(dimSize, dimSize)
        )
    }

    private Draw(): void {
        const time = (this.Entity.GameTime / 1000).toFixed(2)
        CanvasLayer.Interface.RenderText(
            `Score: ${this.Entity.Score}, Time: ${time}s`,
            new Vector2D(0, 30)
        )
    }
}
