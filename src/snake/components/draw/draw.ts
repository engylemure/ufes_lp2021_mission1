import { IComponent, Vector2D } from '@/utils'
import { SnakePart } from '@/snake'
import { RenderLayer } from '@/render-layer'

const MOVE_DURATION = 150

export class SnakePartDrawComponent implements IComponent {
    public Entity: SnakePart
    private _lastDeltaTime: number = 0
    private _start: Vector2D
    constructor(
        public readonly Image: HTMLImageElement,
        public sizeFactor = 1,
        private Canvas = RenderLayer.Foreground
    ) {}

    public Awake(): void {
        this._start = this.Entity.Start.Clone()
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        this.Entity.AdjustSize(() => {
            this._start = this.Entity.Start.Clone()
        })
        if (!this._start.equals(this.Entity.Start)) {
            this._updateStart(deltaTime)
        }
        this._lastDeltaTime = deltaTime
        this.Draw()
    }

    private calcIncFromDeltaTime(deltaTime: number): number {
        const diff = Math.abs(deltaTime - this._lastDeltaTime)
        const val = diff / MOVE_DURATION
        return Math.round(
            diff > 0 ? this.Entity.Size.x * val : this.Entity.Size.x / 15
        )
    }

    private _updateStart(deltaTime: number): void {
        const inc = this.calcIncFromDeltaTime(deltaTime)
        if (
            this._start.x > this.Canvas.Size.x ||
            this._start.x > this.Canvas.Size.y ||
            this._start.x < 0 ||
            this._start.y < 0 ||
            this._start.Sub(this.Entity.Start).Module() < inc/2
        ) {
            this._start = this.Entity.Start.Clone()
        } else {
            if (this._start.x > this.Entity.Start.x) this._start.x -= inc
            else if (this._start.x < this.Entity.Start.x) this._start.x += inc
            if (this._start.y > this.Entity.Start.y) this._start.y -= inc
            else if (this._start.y < this.Entity.Start.y) this._start.y += inc
        }
    }

    private Draw(): void {
        const resizeResult = Vector2D.Resize(
            this.sizeFactor,
            this.Entity.Size,
            this._start,
            this._start.Add(this.Entity.Size)
        )
        if (resizeResult) {
            this.Canvas.Rotate(this.Entity.RotateAngle).RenderImage(
                resizeResult.Start,
                resizeResult.End.Sub(resizeResult.Start),
                this.Image
            )
        } else {
            this.Canvas.Rotate(this.Entity.RotateAngle).RenderImage(
                this._start,
                this.Entity.Size,
                this.Image
            )
        }
    }

    public Clear(): void {
        this.Canvas.ClearRect(this._start, this.Entity.Size)
    }
}
