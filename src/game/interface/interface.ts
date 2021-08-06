import { Entity } from '@/utils'
import { GameState, GAME_EVENTS } from '../game'
import { InterfaceDrawComponent } from './components'

export class Interface extends Entity {
    private _gameTime = 0

    constructor(private gameState: GameState) {
        super()
        gameState.onEvent(GAME_EVENTS.RESTART, this.onRestart.bind(this))
        gameState.onEvent(GAME_EVENTS.OVER, this.onRestart.bind(this))
    }

    public Awake(): void {
        this.AddComponent(new InterfaceDrawComponent())
        super.Awake()
    }
    public Update(deltaTime: number): void {
        if (!this.gameState.isPaused) {
            if (deltaTime > 0) {
                this._gameTime += deltaTime
            }
        }
        super.Update(deltaTime)
    }

    private onRestart(): void {
        this._gameTime = 0
    }

    public get GameTime(): number {
        return this._gameTime
    }

    public get Score(): number {
        return this.gameState.Score
    }
}
