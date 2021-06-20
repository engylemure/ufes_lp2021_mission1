import { Canvas, Vector2D } from '@/utils'
import { Settings } from '@/settings'

export class CanvasLayer {
    private static _background: Canvas
    private static _foreground: Canvas

    private constructor() {
        /* haha */
    }

    public static get Background(): Canvas {
        if (!this._background) {
            this._background = this.InitCanvas()
        }

        return this._background
    }

    public static get Foreground(): Canvas {
        if (!this._foreground) {
            this._foreground = this.InitCanvas()
        }

        return this._foreground
    }

    public static InitCanvas(): Canvas {
        const size =
            (Settings.grid.nodeSize + Settings.grid.nodeOffset) *
                Settings.grid.dimension +
            Settings.grid.nodeOffset
        const canvas = new Canvas(new Vector2D(size, size))
        canvas.Awake()
        return canvas
    }
}
