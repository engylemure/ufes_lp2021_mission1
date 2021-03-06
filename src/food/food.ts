import { Canvas, Entity, Vector2D } from '@/utils'
import { Settings } from '@/settings'
import { RenderLayer } from '@/render-layer'
import { FoodDrawComponent } from './components'

export type FoodState = { index: Vector2D }

export class Food extends Entity {
    constructor(
        public Start: Vector2D,
        public End: Vector2D,
        public Index: Vector2D,
        public Canvas: Canvas = RenderLayer.Foreground
    ) {
        super()
    }

    public Awake(): void {
        this.AddComponent(new FoodDrawComponent())
        super.Awake()
    }

    public AdjustSize(): boolean {
        const shouldAdjust = this.Size.x != Settings.grid.nodeSize
        if (shouldAdjust) {
            this.GetComponent(FoodDrawComponent).Clear()
            const { Start, End, Index } = Vector2D.NodeArgsFromIndex(this.Index)
            this.Start = Start
            this.End = End
            this.Index = Index
        }
        return shouldAdjust
    }

    public Update(deltaTime: number): void {
        super.Update(deltaTime)
    }
    private static get RandomDim(): number {
        return Math.floor(Math.random() * Settings.grid.dimension)
    }

    public static get RandomIndex(): Vector2D {
        return new Vector2D(this.RandomDim, this.RandomDim)
    }

    public UpdatePosition(
        Start: Vector2D,
        End: Vector2D,
        Index: Vector2D
    ): void {
        this.Start = Start
        this.End = End
        this.Index = Index
    }

    public get Size(): Vector2D {
        return new Vector2D(
            this.End.x - this.Start.x,
            this.End.y - this.Start.y
        )
    }

    public SaveState(): FoodState {
        return {
            index: this.Index.Clone(),
        }
    }

    public LoadState(state: FoodState): void {
        const { Start, End, Index } = Vector2D.NodeArgsFromIndex(state.index)
        this.Index = Index
        this.Start = Start
        this.End = End
    }
}
