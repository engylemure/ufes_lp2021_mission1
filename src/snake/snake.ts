import { Entity, Vector2D } from '@/utils'
import { Color } from '@/utils/color'
import { Settings } from '@/settings'
import { GameState, GAME_EVENTS } from '@/game'
import { SnakePart, SnakePartSave, SNAKE_PART } from './snake_part'
import { SnakeAudioComponent } from './components/audio'

export enum DIRECTION {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

enum HEAD_ANGLE {
    UP = (270 * Math.PI) / 180,
    RIGHT = 0,
    DOWN = (90 * Math.PI) / 180,
    LEFT = (180 * Math.PI) / 180,
}

export const SnakeColor: Color = new Color(247, 76, 0, 1)
export type SnakeState = {
    direction: DIRECTION
    head: SnakePartSave
    tail: SnakePartSave[]
}

export class Snake extends Entity {
    private deltaTimeSinceLastUpdate = 0
    private directionSinceLastUpdate: DIRECTION | null = null
    private _direction: DIRECTION = DIRECTION.RIGHT

    private head: SnakePart
    private tail: SnakePart[] = []

    constructor(private readonly gameState: GameState) {
        super()
        this.listenToEvents()
    }

    public changeDirection(direction: DIRECTION): void {
        if (
            this.tail.length > 0 &&
            ((direction == DIRECTION.DOWN &&
                this.directionSinceLastUpdate == DIRECTION.UP) ||
                (direction == DIRECTION.RIGHT &&
                    this.directionSinceLastUpdate == DIRECTION.LEFT) ||
                (direction == DIRECTION.LEFT &&
                    this.directionSinceLastUpdate == DIRECTION.RIGHT) ||
                (direction == DIRECTION.UP &&
                    this.directionSinceLastUpdate == DIRECTION.DOWN))
        ) {
            return
        }
        this._direction = direction
    }

    public get direction(): DIRECTION {
        return this._direction
    }

    public Awake(): void {
        super.Awake()
        const { Start, End, Index } = Vector2D.NodeArgsFromIndex(
            Vector2D.Origin
        )
        this._direction = DIRECTION.RIGHT
        this.head = new SnakePart(SNAKE_PART.HEAD, Start, End, Index)
        this.head.Awake()
        const audioComponent = new SnakeAudioComponent(this.gameState)
        audioComponent.Awake()
        this.AddComponent(audioComponent)
    }

    private UpdateHead(): void {
        switch (this.direction) {
            case DIRECTION.LEFT:
                this.head.RotateAngle = HEAD_ANGLE.LEFT
                break
            case DIRECTION.UP:
                this.head.RotateAngle = HEAD_ANGLE.UP
                break
            case DIRECTION.RIGHT:
                this.head.RotateAngle = HEAD_ANGLE.RIGHT
                break
            case DIRECTION.DOWN:
                this.head.RotateAngle = HEAD_ANGLE.DOWN
        }
    }
    public Update(deltaTime: number): void {
        super.Update(deltaTime)
        if (!this.gameState.isPaused) {
            this.UpdateHead()
            if (
                (this.deltaTimeSinceLastUpdate >= Settings.snake.speed ||
                    this.deltaTimeSinceLastUpdate < 0) &&
                !this.gameState.isPaused
            ) {
                this.deltaTimeSinceLastUpdate = 0
                this.directionSinceLastUpdate = this.direction
                let lastPos = this.head.Index
                let newIndex
                switch (this.direction) {
                    case DIRECTION.LEFT:
                        newIndex = lastPos.Add(new Vector2D(-1, 0))
                        break
                    case DIRECTION.UP:
                        newIndex = lastPos.Add(new Vector2D(0, -1))
                        break
                    case DIRECTION.DOWN:
                        newIndex = lastPos.Add(new Vector2D(0, 1))
                        break
                    case DIRECTION.RIGHT:
                        newIndex = lastPos.Add(new Vector2D(1, 0))
                }
                // Overrided Move
                if (newIndex.x < 0) {
                    newIndex.x = Settings.grid.dimension - 1
                }
                if (newIndex.x >= Settings.grid.dimension) {
                    newIndex.x = 0
                }
                if (newIndex.y < 0) {
                    newIndex.y = Settings.grid.dimension - 1
                }
                if (newIndex.y >= Settings.grid.dimension) {
                    newIndex.y = 0
                }
                this.head.Move(newIndex)
                for (const part of this.tail) {
                    if (this.head.Index.equals(part.Index)) {
                        // Handle Collision
                        this.gameState.Over()
                        return
                    }
                    const tempPos = part.Index
                    part.Move(lastPos)
                    lastPos = tempPos
                }
            } else {
                this.deltaTimeSinceLastUpdate += deltaTime
            }
        }
        this.head.Update(deltaTime)
        this.tail.forEach((part) => part.Update(deltaTime))
    }

    public isIndexAtSnake(index: Vector2D): boolean {
        return (
            this.isIndexAtHead(index) ||
            (!!this.tail.length &&
                !!this.tail.find((part) => part.Index.equals(index)))
        )
    }

    public isIndexAtHead(index: Vector2D): boolean {
        return this.head?.Index.equals(index)
    }

    public Eat(): void {
        const { Start, End, Index } = Vector2D.NodeArgsFromIndex(
            this.head.Index.Clone()
        )
        const part = new SnakePart(
            SNAKE_PART.TAIL,
            Start,
            End,
            Index,
            this.tail.length + 1
        )
        part.Awake()
        this.tail.push(part)
    }

    private listenToEvents(): void {
        this.gameState.onEvent(GAME_EVENTS.RESTART, this.onRestart.bind(this))
        this.gameState.onEvent(GAME_EVENTS.EAT, this.Eat.bind(this))
    }

    public onRestart(): void {
        this.ResetState()
        this.Awake()
    }

    public ResetState(): void {
        this.head.Clear()
        this.tail.forEach((part) => part.Clear())
        this.tail = []
    }

    public SaveState(): SnakeState {
        return {
            direction: this.direction,
            head: this.head.Save(),
            tail: this.tail.map((part) => part.Save()),
        }
    }

    public LoadState(state: SnakeState): void {
        this._direction = state.direction
        this.ResetState()
        this.head = SnakePart.Load(state.head)
        this.head.Awake()
        this.tail = state.tail.map((part) => SnakePart.Load(part))
        this.tail.forEach((part) => part.Awake())
    }
}
