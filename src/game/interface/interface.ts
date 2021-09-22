import { Entity } from '@/utils'
import { GameSave } from '../components'
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

    public get HighestScore(): number {
        return this.gameState.HighestScore
    }

    public get SavedData(): GameSave | undefined {
        return this.gameState.GameSave
    }

    public get HasStarted(): boolean {
        return this.gameState.HasStarted
    }

    public Save(): void {
        this.gameState.Save()
    }

    public Load(): void {
        this.gameState.Load()
    }

    public Restart(): void {
        this.gameState.Restart()
    }

    public Resume(): void {
        this.gameState.Start()
    }

    public Pause(): void {
        this.gameState.Pause()
    }
}
