import { Canvas, Vector2D } from '@/utils'
import imgSrc from '@/images/food.png'
import { Node } from '@/node'
import { Settings } from '@/settings'

const FoodImg = new Image()
FoodImg.src = imgSrc

export class Food extends Node {
    constructor(
        Start: Vector2D,
        End: Vector2D,
        Index: Vector2D,
        canvas?: Canvas
    ) {
        super(Start, End, Index, undefined, FoodImg, canvas)
    }

    private static get RandomDim(): number {
        return Math.floor(Math.random() * Settings.grid.dimension)
    }

    public static get RandomIndex(): Vector2D {
        return new Vector2D(this.RandomDim, this.RandomDim)
    }
}
