import { Vector2D } from '@/utils'
import { NodeDrawComponent } from './components'
import { Node } from './node'

describe('>>> Node', () => {
    let node: Node
    const start = new Vector2D(1, 2)
    const end = new Vector2D(5, 6)
    const index = new Vector2D(1, 1)

    beforeEach(() => {
        node = new Node(start, end, index)
    })

    it('should awake and update all Components', () => {
        // --- ADD --- //
        const spyDrawCompAwake = jest.spyOn(
            NodeDrawComponent.prototype,
            'Awake'
        )
        const spyDrawCompUpdate = jest.spyOn(
            NodeDrawComponent.prototype,
            'Update'
        )

        expect(spyDrawCompAwake).not.toBeCalled()
        expect(spyDrawCompUpdate).not.toBeCalled()

        node.Awake()
        expect(spyDrawCompAwake).toBeCalled()

        node.Update(0)
        expect(spyDrawCompUpdate).toBeCalled()
        // --- ADD --- //
    })

    it('should calculate size', () => {
        expect(node.Size.x).toBe<number>(end.x - start.x)
        expect(node.Size.y).toBe<number>(end.y - start.y)
    })
})
