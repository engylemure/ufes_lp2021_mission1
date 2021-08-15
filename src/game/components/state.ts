import { Food } from '@/food'
import { Settings } from '@/settings'
import { IComponent } from '@/utils'
import { EventEmitter, Listener } from 'events'
import ololog from 'ololog'
import { Game, GAME_EVENTS } from '..'

const log = ololog.configure({ time: true, locate: false })

export type GameStateData = {
    isPaused: boolean
    matchTime: number
    score: number
}

export class GameState extends EventEmitter implements IComponent {
    public Entity: Game
    private _isPaused = false
    private _matchTime = 0
    private _score = 0

    constructor() {
        super()
        this.onEvent(GAME_EVENTS.PAUSE, this.onPause.bind(this))
        this.onEvent(GAME_EVENTS.START, this.onStart.bind(this))
        this.onEvent(GAME_EVENTS.RESTART, this.Awake.bind(this))
        this.onEvent(GAME_EVENTS.OVER, this.Awake.bind(this))
        this.onEvent(GAME_EVENTS.SAVE, this.onSave.bind(this))
        this.onEvent(GAME_EVENTS.LOAD, this.onLoad.bind(this))
    }

    public Update(deltaTime: number): void {
        if (!this.isPaused) {
            if (deltaTime > 0) {
                this._matchTime += deltaTime
            }
        }
    }

    public Awake(): void {
        this._isPaused = false
        this._score = 0
        this._matchTime = 0
    }

    debugInfo(): { score: number; isPaused: boolean } {
        return {
            score: this._score,
            isPaused: this._isPaused,
        }
    }

    debug(...args: any): void {
        if (Settings.isDev) {
            log(args.length > 0 ? args : this.debugInfo())
        }
    }

    private debugEvent(event: GAME_EVENTS): void {
        if (Settings.isDev) {
            log(event, this.debugInfo())
        }
    }

    public get isPaused(): boolean {
        return this._isPaused
    }

    Pause(): void {
        this.debugEvent(GAME_EVENTS.PAUSE)
        this.emit(GAME_EVENTS.PAUSE)
    }

    Start(): void {
        this.debugEvent(GAME_EVENTS.START)
        this.emit(GAME_EVENTS.START)
    }

    Eat(food: Food): void {
        this._score += 1
        this.debugEvent(GAME_EVENTS.EAT)
        this.emit(GAME_EVENTS.EAT, food)
    }

    Restart(): void {
        this._score = 0
        this.debugEvent(GAME_EVENTS.RESTART)
        this.emit(GAME_EVENTS.RESTART)
    }

    Over(): void {
        this._score = 0
        this.debugEvent(GAME_EVENTS.OVER)
        this.emit(GAME_EVENTS.OVER)
    }

    Save(): void {
        this.debugEvent(GAME_EVENTS.SAVE)
        this.emit(GAME_EVENTS.SAVE)
    }

    Load(): void {
        this.debugEvent(GAME_EVENTS.LOAD)
        this.emit(GAME_EVENTS.LOAD)
    }

    private onSave(): void {
        this.Entity.SaveState()
    }

    private onLoad(): void {
        this.Entity.LoadState()
    }

    private onPause(): void {
        this._isPaused = true
        this.debug()
    }

    private onStart(): void {
        this._isPaused = false
        this.debug()
    }

    onEvent(event: GAME_EVENTS, callback: Listener): void {
        this.on(event, callback)
    }

    public get Score(): number {
        return this._score
    }

    public get MatchTime(): number {
        return this._matchTime
    }

    public SaveData(): GameStateData {
        return {
            score: this.Score,
            matchTime: this.MatchTime,
            isPaused: this.isPaused,
        }
    }

    public LoadData(data: GameStateData) {
        this._score = data.score
        this._matchTime = data.matchTime
        this._isPaused = data.isPaused
    }
}
