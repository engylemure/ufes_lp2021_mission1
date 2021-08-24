import { RenderLayer } from './render-layer'
import { Canvas } from '@/utils'

jest.mock('@/utils')
describe('>>> CanvasLayer', () => {
    it('should create canvas only once', () => {
        expect(Canvas).not.toBeCalled()
        const canvas1 = RenderLayer.Background
        const canvas2 = RenderLayer.Background

        expect(canvas1).toBe(canvas2)
        expect(Canvas).toBeCalledTimes(1)
    })
})
