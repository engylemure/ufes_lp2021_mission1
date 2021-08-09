import { Node } from './node'
import { Vector2D } from '@/utils'

export const mockNodeFactory = (
    start = Vector2D.Origin,
    end = new Vector2D(1, 1),
    index = Vector2D.Origin
): Node => new Node(start, end, index)
