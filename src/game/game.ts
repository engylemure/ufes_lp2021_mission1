import { Entity, Vector2D } from '@/utils'
import { Grid } from '@/grid'
import { Interface } from './interface'
import { DIRECTION, Snake, SnakeState } from '@/snake'

import { Food, FoodState } from '@/food/food'
import { CanvasLayer } from '@/canvas-layer'
import { GameState, GameStateData } from './components'
export { GameState } from './components'

export enum GAME_EVENTS {
    START = 'start',
    PAUSE = 'pause',
    RESTART = 'restart',
    EAT = 'eat',
    OVER = 'over',
    SAVE = 'save',
    LOAD = 'load',
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

export class Game extends Entity {
    private _lastTimestamp = 0
    private _entities: Entity[] = []
    private _snake: Snake
    private _savedState?: {
        gameData: GameStateData
        snakeState: SnakeState
        foodState: FoodState
    }
    private _food: Food
    private _nextKey: KEYS | null = null

    public get Entities(): Entity[] {
        return this._entities
    }

    constructor() {
        super()
        // start update loop
        this.Update()
        this.attachKeyboard()
    }

    public Awake(): void {
        const state = new GameState()
        this.AddComponent(state)
        state.on(GAME_EVENTS.OVER, () => {
            this._snake.onRestart()
        })
        super.Awake()
        this._entities.push(new Grid())
        this._snake = new Snake(state)
        this._entities.push(this._snake)
        this._entities.push(new Interface(state))
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

    private get state(): GameState {
        return this.GetComponent(GameState)
    }

    private handleKeydown(e: KeyboardEvent): void {
        if (this._nextKey == null || this._nextKey != e.code) {
            const code = e.code as KEYS
            this._nextKey = this.state.isPaused
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
                this.state.isPaused ? this.state.Start() : this.state.Pause()
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
        const { Start, End, Index } = Vector2D.NodeArgsFromIndex(index)
        return new Food(Start, End, Index, CanvasLayer.Foreground)
    }

    private updateFoodIndex(): void {
        let index: Vector2D
        while (
            (index = Food.RandomIndex) &&
            (this._snake.isIndexAtSnake(index) ||
                this._food.Index.equals(index))
        );
        const { Start, End, Index } = Vector2D.NodeArgsFromIndex(index)
        this._food.UpdatePosition(Start, End, Index)
    }

    private checkFoodCollision(): void {
        if (this._food && this._snake.isIndexAtHead(this._food.Index)) {
            this.state.Eat(this._food)
            this.updateFoodIndex()
        }
    }

    public SaveState(): void {
        this._savedState = {
            snakeState: this._snake.SaveState(),
            gameData: this.GetComponent(GameState).SaveData(),
            foodState: this._food.SaveState(),
        }
    }

    public LoadState(): void {
        if (this._savedState) {
            this._snake.LoadState(this._savedState.snakeState)
            this.GetComponent(GameState).LoadData(this._savedState.gameData)
            this._food.LoadState(this._savedState.foodState)
        }
    }
}
