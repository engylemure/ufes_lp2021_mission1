import { Vector2D } from '@/utils'
import { Color } from '../color'
import { IAwake } from '../lifecycle'
import { Root } from '../root'

export class Canvas implements IAwake {
    private _rotateArg?: number
    private _elm: HTMLCanvasElement
    private _ctx: CanvasRenderingContext2D
    constructor(public readonly root: Root, public Size: Vector2D, public readonly name: string) {}

    public Awake(): void {
        const canvas = document.createElement('canvas')
        canvas.id = this.name
        canvas.setAttribute('width', `${this.Size.x}px`)
        canvas.setAttribute('height', `${this.Size.y}px`)
        this._elm = canvas
        this.root.AddElement(canvas)
        const ctx = this._elm.getContext('2d')
        if (!ctx) {
            throw new Error('Context `2d` identifier is not supported')
        }
        this._ctx = ctx
    }

    public Rotate(angle: number): Canvas {
        this._rotateArg = angle
        return this
    }

    private _rotate(start: Vector2D, size: Vector2D): void {
        if (this._rotateArg) {
            const x = start.x + size.x / 2,
                y = start.y + size.y / 2
            this._ctx.translate(x, y)
            this._ctx.rotate(this._rotateArg)
            this._ctx.translate(-x, -y)
        }
    }

    private _clearRotation(): void {
        if (this._rotateArg) {
            this._rotateArg = undefined
            this._ctx.setTransform(1, 0, 0, 1, 0, 0)
        }
    }

    public FillRect(start: Vector2D, size: Vector2D, color: Color): void {
        this._rotate(start, size)
        this._ctx.beginPath()
        this._ctx.fillStyle = color.AsString()
        this._ctx.rect(start.x, start.y, size.x, size.y)
        this._ctx.fill()
        this._clearRotation()
    }

    public ClearRect(start: Vector2D, size: Vector2D): void {
        this._ctx.clearRect(start.x, start.y, size.x, size.y)
        this._clearRotation()
    }

    public FillCircle(center: Vector2D, radius: number, color: Color): void {
        this._ctx.beginPath()
        this._ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
        this._ctx.fillStyle = color.AsString()
        this._ctx.fill()
        this._clearRotation()
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
            this._rotate(start, size)
            this._ctx.drawImage(img, start.x, start.y, size.x, size.y)
        }
        this._clearRotation()
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
        const font = this._ctx.font
        canvas.setAttribute('width', `${this.Size.x}px`)
        canvas.setAttribute('height', `${this.Size.y}px`)
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.font = font
            this._ctx = ctx
        }
    }

    public get FontSize(): number {
        return this.Size.x / 30
    }
}
