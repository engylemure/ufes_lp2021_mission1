import { Node } from '@/node'
import { Settings } from '@/settings'
import { Vector2D } from '@/utils'
import { Color } from '@/utils/color'

export class Scalable extends Node {
    constructor(
        public Start: Vector2D,
        public End: Vector2D,
        public Index: Vector2D,
        public color: Color = Settings.grid.color
    ) {
        super(Start, End, Index, color)
    }

    public UpdatePosition(
        Start: Vector2D,
        End: Vector2D,
        Index: Vector2D,
        color: Color = this.color
    ): void {
        this.Start = Start
        this.End = End
        this.Index = Index
        this.color = color
    }
}
