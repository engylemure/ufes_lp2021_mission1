import { Vector2D } from '@/utils'
import { Color } from '../color'
import { IAwake } from '../lifecycle'

export class Canvas implements IAwake {
    private _elm: HTMLCanvasElement
    private _ctx: CanvasRenderingContext2D
    constructor(public Size: Vector2D, public readonly name: string) {}

    public Awake(): void {
        const canvas = document.createElement('canvas')
        canvas.id = this.name
        canvas.setAttribute('width', `${this.Size.x}px`)
        canvas.setAttribute('height', `${this.Size.y}px`)
        document.body.appendChild(canvas)
        this._elm = canvas

        const ctx = this._elm.getContext('2d')
        if (!ctx) {
            throw new Error('Context `2d` identifier is not supported')
        }
        this._ctx = ctx
    }

    public FillRect(start: Vector2D, size: Vector2D, color: Color): void {
        this._ctx.beginPath()
        this._ctx.fillStyle = color.AsString()
        this._ctx.rect(start.x, start.y, size.x, size.y)
        this._ctx.fill()
    }

    public ClearRect(start: Vector2D, size: Vector2D): void {
        this._ctx.clearRect(start.x, start.y, size.x, size.y)
    }

    public FillCircle(center: Vector2D, radius: number, color: Color): void {
        this._ctx.beginPath()
        this._ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
        this._ctx.fillStyle = color.AsString()
        this._ctx.fill()
    }

    public RenderImage(
        start: Vector2D,
        size: Vector2D,
        img: HTMLImageElement
    ): void {
        if (window.__DEV__) {
            /* 
                Workaround related to fixing image loading on Jest (Test environment)
            */
        } else {
            this._ctx.drawImage(img, start.x, start.y, size.x, size.y)
        }
    }

    public RenderText(text: string, start: Vector2D): void {
        this._ctx.strokeText(text, start.x, start.y)
    }

    public get Element(): HTMLCanvasElement {
        return this._elm
    }

    public get Context(): CanvasRenderingContext2D {
        return this._ctx
    }

    public hasSameSize(size: Vector2D): boolean {
        return this.Size.equals(size)
    }

    public Resize(size: Vector2D): void {
        this.Size = size
        const canvas = this._elm
        canvas.setAttribute('width', `${this.Size.x}px`)
        canvas.setAttribute('height', `${this.Size.y}px`)
    }
}
