import { Canvas, Vector2D } from '@/utils'
import { Settings } from '@/settings'

export class CanvasLayer {
    private static _background: Canvas
    private static _foreground: Canvas
    private static _interface: Canvas

    private constructor() {
        /* haha */
    }

    public static ensureSize(): void {
        this.checkAndResize(this.Background)
        this.checkAndResize(this.Foreground)
        this.checkAndResize(this.Interface)
    }

    private static checkAndResize(canvas: Canvas): void {
        if (!canvas.hasSameSize(this.Size)) {
            canvas.Resize(this.Size)
        }
    }

    public static get Background(): Canvas {
        if (!this._background) {
            this._background = this.InitCanvas('Background')
        }
        return this._background
    }

    public static get Foreground(): Canvas {
        if (!this._foreground) {
            this._foreground = this.InitCanvas('Foreground')
        }

        return this._foreground
    }

    public static get Interface(): Canvas {
        if (!this._interface) {
            this._interface = this.InitCanvas('Interface')
        }
        return this._interface
    }

    public static get Size(): Vector2D {
        const size =
            (Settings.grid.nodeSize + Settings.grid.nodeOffset) *
                Settings.grid.dimension +
            Settings.grid.nodeOffset
        return new Vector2D(size, size)
    }

    public static InitCanvas(name: string): Canvas {
        const canvas = new Canvas(this.Size, name)
        canvas.Awake()
        return canvas
    }
}
