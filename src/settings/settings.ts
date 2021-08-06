import { Color } from '@/utils/color'

function getSize(): { height: number; width: number } {
    const body = document.body
    const html = document.documentElement
    return {
        height: Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        ),
        width: Math.max(
            body.scrollWidth,
            body.offsetWidth,
            html.clientWidth,
            html.scrollWidth,
            html.offsetWidth
        ),
    }
}
class GridSettings {
    static dimension = 16
    static nodeOffset = 10
    static color: Color = new Color(245, 245, 245, 1)
    public static get nodeSize(): number {
        const { height, width } = getSize()
        const smallerDim = height > width ? width : height
        return (
            (smallerDim - this.nodeOffset * this.dimension * 1.5) /
            this.dimension
        )
    }
}

export enum GAME_ENV {
    DEV,
    PROD,
}

class _Settings {
    grid = GridSettings
    snake = {
        speed: 120,
    }
    env = GAME_ENV.PROD

    public get isDev(): boolean {
        return this.env === GAME_ENV.DEV
    }
}

export const Settings = new _Settings()

declare global {
    interface Window {
        [index: string]: any
    }
}

function debugGame(): void {
    Settings.env = GAME_ENV.DEV
}

window['gameSettings'] = Settings
window['gameDebug'] = debugGame
