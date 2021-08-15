import { Food } from '@/food'
import { IComponent, Vector2D } from '@/utils'
import imgSrc from '@/images/food.png'

const FoodImg = new Image()
FoodImg.src = imgSrc

const RESIZE_INC = 0.025

export class FoodDrawComponent implements IComponent {
    public Entity: Food
    private _index: Vector2D
    private _start: Vector2D
    private _size: Vector2D
    private _isIncreasing = false
    constructor() {}
    public Awake(): void {
        this._start = this.Entity.Start
        this._size = this.Entity.Size
        this._index = this.Entity.Index
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        const hasAdjusted = this.Entity.AdjustSize()
        if (!this._index.equals(this.Entity.Index) || hasAdjusted) {
            this._start = this.Entity.Start
            this._index = this.Entity.Index
            this._size = this.Entity.Size
        }
        if (this._size.x < this.Entity.Size.x / 1.25) {
            this._isIncreasing = true
        } else if (this._size.x > this.Entity.Size.x) {
            this._isIncreasing = false
        }
        if (this._isIncreasing) {
            this._start = this._start.Sub(new Vector2D(RESIZE_INC, RESIZE_INC))
            this._size = this._size.Add(
                new Vector2D(2 * RESIZE_INC, 2 * RESIZE_INC)
            )
        } else {
            this._start = this._start.Add(new Vector2D(RESIZE_INC, RESIZE_INC))
            this._size = this._size.Sub(
                new Vector2D(2 * RESIZE_INC, 2 * RESIZE_INC)
            )
        }
        this.Draw(this._start, this._size)
    }

    private Draw(Start: Vector2D, Size: Vector2D): void {
        this.Entity.Canvas.RenderImage(Start, Size, FoodImg)
    }

    public Clear(): void {
        this.Entity.Canvas.ClearRect(this._start, this.Entity.Size)
    }
}
