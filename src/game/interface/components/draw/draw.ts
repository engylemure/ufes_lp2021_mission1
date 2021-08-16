import { IComponent, Vector2D } from '@/utils'
import { Interface } from '@/game/interface'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'
import prettyMs from 'pretty-ms'

export class InterfaceDrawComponent implements IComponent {
    public Entity: Interface

    public Awake(): void {
        this.Clear()
    }

    private get FontSize(): number {
        return CanvasLayer.Interface.Size.x / 30
    }

    public Update(deltaTime: number): void {
        this.Clear()
        CanvasLayer.Interface.Context.font = `${CanvasLayer.Interface.FontSize}px Arial`
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
        CanvasLayer.Interface.RenderText(
            `Score: ${this.Entity.Score}, Time: ${prettyMs(
                this.Entity.GameTime,
                { secondsDecimalDigits: 2 }
            )}`,
            new Vector2D(0, CanvasLayer.Interface.FontSize)
        )
        CanvasLayer.Interface.RenderText(
            `FPS:${this.Entity.FPS.toFixed(1)}`,
            new Vector2D(
                CanvasLayer.Interface.Size.x -
                    CanvasLayer.Interface.FontSize * 5,
                CanvasLayer.Interface.FontSize
            )
        )
    }
}
