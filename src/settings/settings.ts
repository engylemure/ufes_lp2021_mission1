import { Color } from '@/utils/color'

const MinDim = 720

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
        const smallerDim = Math.max(MinDim, Math.min(height, width))
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

export enum SNAKE_SPEED_DIFFICULTY {
    SANDBOX = 220,
    EASY = 180,
    NORMAL = 140,
    HARD = 100,
}

class _Settings {
    grid = GridSettings
    snake = {
        speed: SNAKE_SPEED_DIFFICULTY.NORMAL,
    }
    env = GAME_ENV.PROD
    public changeSnakeSpeed(speed: SNAKE_SPEED_DIFFICULTY): void {
        this.snake.speed = speed
    }
    public get snakeSpeed(): SNAKE_SPEED_DIFFICULTY {
        return this.snake.speed
    }
    public get isDev(): boolean {
        return this.env === GAME_ENV.DEV
    }
}

export const Settings = new _Settings()

declare global {
    interface Window {
        [index: string]: any
        __DEV__: boolean
    }
}

function debugGame(): void {
    Settings.env = GAME_ENV.DEV
}

window['gameSettings'] = Settings
window['gameDebug'] = debugGame
