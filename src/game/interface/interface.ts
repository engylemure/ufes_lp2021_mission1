import { Entity } from '@/utils'
import { GameState, GAME_EVENTS } from '../game'
import { InterfaceDrawComponent } from './components'

export class Interface extends Entity {
    constructor(private gameState: GameState) {
        super()
    }

    public Awake(): void {
        this.AddComponent(new InterfaceDrawComponent())
        super.Awake()
    }
    public Update(deltaTime: number): void {
        super.Update(deltaTime)
    }

    public get GameTime(): number {
        return this.gameState.MatchTime
    }

    public get Score(): number {
        return this.gameState.Score
    }
}
