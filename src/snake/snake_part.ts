import { Settings } from '@/settings'
import { Entity, Vector2D } from '@/utils'
import { SNAKE } from './assets'
import { SnakePartDrawComponent } from './components'

const TailImg = new Image()
TailImg.src = SNAKE.TAIL
const HeadImg = new Image()
HeadImg.src = SNAKE.HEAD

export enum SNAKE_PART {
    HEAD,
    TAIL,
}

export class SnakePart extends Entity {
    constructor(
        public part: SNAKE_PART,
        public Start: Vector2D,
        public End: Vector2D,
        public Index: Vector2D,
        private factor: number = 1,
        public RotateAngle: number = 0
    ) {
        super()
    }

    public Awake(): void {
        this.AddComponent(
            new SnakePartDrawComponent(
                this.part === SNAKE_PART.HEAD ? HeadImg : TailImg,
                this.factor
            )
        )
        super.Awake()
    }

    public get Size(): Vector2D {
        return new Vector2D(
            this.End.x - this.Start.x,
            this.End.y - this.Start.y
        )
    }

    private hadAbruptChange(idx: Vector2D): boolean {
        return (
            (this.Index.x == 0 && idx.x == Settings.grid.dimension - 1) ||
            (this.Index.x == Settings.grid.dimension - 1 && idx.x == 0) ||
            (this.Index.y == 0 && idx.y == Settings.grid.dimension - 1) ||
            (this.Index.y == Settings.grid.dimension - 1 && idx.y == 0)
        )
    }

    public Move(idx: Vector2D): void {
        const { Start, End, Index } = Vector2D.NodeArgsFromIndex(idx)
        this.Start = Start
        this.End = End
        const shouldRenderAtNewIndex = this.hadAbruptChange(idx)
        this.Index = Index
        if (shouldRenderAtNewIndex) {
            this.Clear()
            this.GetComponent(SnakePartDrawComponent).Awake()
        }
    }

    public AdjustSize(afterAdjustment: () => void): void {
        if (this.Size.x != Settings.grid.nodeSize) {
            const { Start, End, Index } = Vector2D.NodeArgsFromIndex(this.Index)
            this.Start = Start
            this.End = End
            this.Index = Index
            afterAdjustment()
        }
    }

    public Update(deltaTime: number): void {
        super.Update(deltaTime)
    }

    public Clear(): void {
        this.GetComponent(SnakePartDrawComponent).Clear()
    }

    public Clone(): SnakePart {
        return new SnakePart(
            this.part,
            this.Start.Clone(),
            this.End.Clone(),
            this.Index.Clone(),
            this.factor,
            this.RotateAngle
        )
    }
}
