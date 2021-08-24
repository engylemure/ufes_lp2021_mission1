import { Entity } from '@/utils'
import { GameState } from '../game'
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

    public get FPS(): number {
        return this.gameState.FPS
    }

    public get isPaused(): boolean {
        return this.gameState.isPaused
    }
}
