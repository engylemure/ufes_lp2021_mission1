import { Entity, Vector2D } from '@/utils'
import { Grid } from '@/grid'
import { Interface } from './interface'
import { DIRECTION, Snake } from '@/snake'

import { EventEmitter, Listener } from 'events'
import { Food } from '@/food/food'
import { Settings } from '@/settings'
import ololog from 'ololog'
import { CanvasLayer } from '@/canvas-layer'

const log = ololog.configure({ time: true, locate: false })

export enum GAME_EVENTS {
    START = 'start',
    PAUSE = 'pause',
    RESTART = 'restart',
    EAT = 'eat',
    OVER = 'over',
}

export enum KEYS {
    ARROW_LEFT = 'ArrowLeft',
    ARROW_UP = 'ArrowUp',
    ARROW_RIGHT = 'ArrowRight',
    ARROW_DOWN = 'ArrowDown',
    W = 'KeyW',
    A = 'KeyA',
    S = 'KeyS',
    D = 'KeyD',
    ENTER = 'Enter',
}

export class GameState extends EventEmitter {
    private _isPaused = false
    private _score = 0

    constructor() {
        super()
        this.onEvent(GAME_EVENTS.PAUSE, this.onPause.bind(this))
        this.onEvent(GAME_EVENTS.START, this.onStart.bind(this))
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
}

export class Game extends Entity {
    private _lastTimestamp = 0
    private _entities: Entity[] = []
    private _snake: Snake
    private _food: Food
    private _nextKey: KEYS | null = null
    private _state = new GameState()

    public get Entities(): Entity[] {
        return this._entities
    }

    constructor() {
        super()
        // start update loop
        this.Update()
        this.attachKeyboard()
        this._state.on(GAME_EVENTS.OVER, () => {
            this._snake.onRestart()
        })
    }

    public Awake(): void {
        super.Awake()
        this._entities.push(new Grid())
        this._snake = new Snake(this._state)
        this._entities.push(this._snake)
        this._entities.push(new Interface(this._state))
        for (const entity of this.Entities) {
            entity.Awake()
        }
        this._food = this.createFood()
        this._entities.push(this._food)
        this._food.Awake()
        window.requestAnimationFrame(() => {
            this._lastTimestamp = Date.now()
            this.Update()
        })
    }

    public Update(timestamp = 0): void {
        CanvasLayer.ensureSize()
        const deltaTime = timestamp - this._lastTimestamp
        this.checkFoodCollision()
        this.checkKey()
        super.Update(deltaTime)
        for (const entity of this.Entities) {
            entity.Update(deltaTime)
        }
        this._lastTimestamp = timestamp
        window.requestAnimationFrame((timestamp) => {
            this.Update(timestamp)
        })
    }

    private handleKeydown(e: KeyboardEvent): void {
        if (this._nextKey == null || this._nextKey != e.code) {
            const code = e.code as KEYS
            this._nextKey = this._state.isPaused
                ? code === KEYS.ENTER
                    ? (code as KEYS)
                    : null
                : code
        }
    }

    private attachKeyboard(): void {
        document.addEventListener('keydown', this.handleKeydown.bind(this))
    }

    private checkKey(): void {
        if (this._nextKey == null) {
            return
        }
        switch (this._nextKey) {
            case KEYS.ENTER:
                this._state.isPaused ? this._state.Start() : this._state.Pause()
                break
            case KEYS.ARROW_UP:
            case KEYS.W:
                this._snake.changeDirection(DIRECTION.UP)
                break
            case KEYS.ARROW_RIGHT:
            case KEYS.D:
                this._snake.changeDirection(DIRECTION.RIGHT)
                break
            case KEYS.ARROW_LEFT:
            case KEYS.A:
                this._snake.changeDirection(DIRECTION.LEFT)
                break
            case KEYS.ARROW_DOWN:
            case KEYS.S:
                this._snake.changeDirection(DIRECTION.DOWN)
                break
        }
        this._nextKey = null
    }

    private createFood(): Food {
        let index: Vector2D
        while ((index = Food.RandomIndex) && this._snake.isIndexAtSnake(index));
        const { Start, End, Index } = Food.NodeArgsFromIndex(index)
        return new Food(Start, End, Index, CanvasLayer.Foreground)
    }

    private updateFoodIndex(): void {
        let index: Vector2D
        while (
            (index = Food.RandomIndex) &&
            (this._snake.isIndexAtSnake(index) ||
                this._food.Index.equals(index))
        );
        const { Start, End, Index } = Food.NodeArgsFromIndex(index)
        this._food.UpdatePosition(Start, End, Index)
    }

    private checkFoodCollision(): void {
        if (this._food && this._snake.isIndexAtHead(this._food.Index)) {
            this._state.Eat(this._food)
            this.updateFoodIndex()
        }
    }
}
