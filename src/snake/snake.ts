import { Entity, Vector2D } from '@/utils'
import { Color } from '@/utils/color'
import { Settings } from '@/settings'
import { Scalable } from '@/scalable'
import { GameState, GAME_EVENTS } from '@/game'

export enum DIRECTION {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

export const SnakeColor: Color = new Color(247, 76, 0, 1)

class SnakePart extends Entity {
    private node: Scalable
    public position: Vector2D
    constructor(node: Scalable, position: Vector2D) {
        super()
        this.node = node
        this.position = position
    }
    public Awake(): void {
        super.Awake()
        this.node.Awake()
    }

    public Update(deltaTime: number): void {
        const { Start, End, Index } = Scalable.NodeArgsFromIndex(this.position)
        this.node
        this.node.UpdatePosition(Start, End, Index)
        this.node.Update(deltaTime)
    }

    public Clear(): void {
        this.node.Clear()
    }
}

export class Snake extends Entity {
    private deltaTimeSinceLastUpdate = 0
    direction: DIRECTION = DIRECTION.RIGHT
    private head: SnakePart
    private tail: SnakePart[] = []

    constructor(private readonly gameState: GameState) {
        super()
        this.listenToEvents()
    }

    public Awake(): void {
        super.Awake()

        const { Start, End, Index } = Scalable.NodeArgsFromIndex(
            new Vector2D(0, 0)
        )

        this.head = new SnakePart(
            new Scalable(Start, End, Index, SnakeColor),
            Index
        )

        this.tail = []
        this.head.Awake()
    }

    public Update(deltaTime: number): void {
        if (
            (this.deltaTimeSinceLastUpdate >= Settings.snake.speed ||
                this.deltaTimeSinceLastUpdate < 0) &&
            !this.gameState.isPaused
        ) {
            this.deltaTimeSinceLastUpdate = 0
            let lastPos = this.head.position
            switch (this.direction) {
                case DIRECTION.LEFT:
                    this.head.position = lastPos.Update({ x: lastPos.x - 1 })
                    break
                case DIRECTION.UP:
                    this.head.position = lastPos.Update({ y: lastPos.y - 1 })
                    break
                case DIRECTION.DOWN:
                    this.head.position = lastPos.Update({ y: lastPos.y + 1 })
                    break
                case DIRECTION.RIGHT:
                    this.head.position = lastPos.Update({ x: lastPos.x + 1 })
            }
            if (this.head.position.x < 0) {
                this.head.position.x = Settings.grid.dimension - 1
            }
            if (this.head.position.x >= Settings.grid.dimension) {
                this.head.position.x = 0
            }
            if (this.head.position.y < 0) {
                this.head.position.y = Settings.grid.dimension - 1
            }
            if (this.head.position.y >= Settings.grid.dimension) {
                this.head.position.y = 0
            }
            for (const part of this.tail) {
                if (this.head.position.equals(part.position)) {
                    // Handle Collision
                    this.gameState.Over()
                    break
                }
                const tempPos = part.position
                part.position = lastPos
                lastPos = tempPos
            }
            this.Eat()
        } else {
            this.deltaTimeSinceLastUpdate += deltaTime
        }
        super.Update(deltaTime)
        this.head.Update(deltaTime)
        this.tail.forEach((part) => part.Update(deltaTime))
    }

    public Eat(): void {
        const { Start, End, Index } = Scalable.NodeArgsFromIndex(
            this.head.position
        )
        const part = new SnakePart(
            new Scalable(Start, End, Index, SnakeColor),
            Index
        )
        part.Awake()
        this.tail.push(part)
    }

    private listenToEvents(): void {
        this.gameState.onEvent(GAME_EVENTS.RESTART, this.onRestart.bind(this))
    }

    public onRestart(): void {
        this.head.Clear()
        this.tail.forEach((part) => part.Clear())
        this.Awake()
    }
}
