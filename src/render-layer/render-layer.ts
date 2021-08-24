import { Canvas, Vector2D } from '@/utils'
import { Settings } from '@/settings'
import { Root } from '@/utils/root/root'

export class RenderLayer {
    private static _background: Canvas
    private static _foreground: Canvas
    private static _root: Root
    private constructor() {
        /* haha */
    }

    public static ensureSize(): void {
        this.checkAndResize(this.Background)
        this.checkAndResize(this.Foreground)
    }

    private static checkAndResize(canvas: Canvas): void {
        if (!canvas.hasSameSize(this.Size)) {
            canvas.Resize(this.Size)
        }
    }

    public static get Root(): Root {
        if (!this._root) {
            const root = new Root(this.Size)
            root.Awake()
            this._root = root
        }
        return this._root
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

    public static get Size(): Vector2D {
        const size =
            (Settings.grid.nodeSize + Settings.grid.nodeOffset) *
                Settings.grid.dimension +
            Settings.grid.nodeOffset
        return new Vector2D(size, size)
    }

    public static InitCanvas(name: string): Canvas {
        const canvas = new Canvas(this.Root, this.Size, name)
        canvas.Awake()
        return canvas
    }
}
