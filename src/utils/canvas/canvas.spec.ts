import { Canvas } from './canvas'
import { Vector2D } from '@/utils'
import { Color } from '../color'
import { Root } from '../root'

describe('>>> Canvas', () => {
    const size = new Vector2D(100, 100)
    let canvas: Canvas
    let root: Root
    beforeEach(() => {
        root = new Root(size)
        root.Awake()
        canvas = new Canvas(root, size, 'test')
    })

    it('should create and attach canvas to the DOM when awakens', () => {
        const createElmSpy = jest.spyOn(document, 'createElement')
        const appendChildSpy = jest.spyOn(root.Elm, 'appendChild')
        expect(createElmSpy).not.toBeCalled()
        expect(appendChildSpy).not.toBeCalled()
        canvas.Awake()
        expect(createElmSpy).toBeCalled()
        expect(appendChildSpy).toBeCalled()
    })

    describe('>> API', () => {
        beforeEach(() => {
            canvas.Awake()
        })

        it('should draw and fill the rect', () => {
            const start = Vector2D.Origin
            const size = new Vector2D(10, 10)
            const beginPathSpy = jest.spyOn(canvas.Context, 'beginPath')
            const rectSpy = jest.spyOn(canvas.Context, 'rect')
            const fillSpy = jest.spyOn(canvas.Context, 'fill')

            canvas.FillRect(start, size, new Color(255, 255, 255, 1))

            expect(beginPathSpy).toBeCalled()
            expect(rectSpy).toBeCalledWith(start.x, start.y, size.x, size.y)
            expect(fillSpy).toBeCalled()
            expect(canvas.Context.fillStyle).toBe<string>('#ffffff')
        })
        it('should clear the rect', () => {
            const start = Vector2D.Origin
            const size = new Vector2D(10, 10)

            const spy = jest.spyOn(canvas.Context, 'clearRect')
            expect(spy).not.toBeCalled()

            canvas.ClearRect(start, size)

            expect(spy).toBeCalledWith(start.x, start.y, size.x, size.y)
        })
        it('should draw and fill the circle', () => {
            const center = Vector2D.Origin
            const radius = 1

            const beginPathSpy = jest.spyOn(canvas.Context, 'beginPath')
            const arcSpy = jest.spyOn(canvas.Context, 'arc')
            const fillSpy = jest.spyOn(canvas.Context, 'fill')

            canvas.FillCircle(center, radius, new Color(255, 255, 255, 1))

            expect(beginPathSpy).toBeCalled()
            expect(arcSpy).toBeCalledWith(
                center.x,
                center.y,
                radius,
                0,
                Math.PI * 2
            )
            expect(fillSpy).toBeCalled()
            expect(canvas.Context.fillStyle).toBe('#ffffff')
        })
    })
})
