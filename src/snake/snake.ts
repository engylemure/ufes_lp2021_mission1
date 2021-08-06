import { Entity, Vector2D } from '@/utils'
import { Color } from '@/utils/color'
import { Settings } from '@/settings'
import { Node } from '@/node'
import { GameState, GAME_EVENTS } from '@/game'
import { SNAKE } from './assets'
import { CanvasLayer } from '@/canvas-layer'

const TailImg = new Image()
TailImg.src = SNAKE.TAIL
const HeadImg = new Image()
HeadImg.src = SNAKE.HEAD.RIGHT

export enum DIRECTION {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

export const SnakeColor: Color = new Color(247, 76, 0, 1)

class SnakePart extends Entity {
    private factor: number
    private node: Node
    public position: Vector2D
    constructor(node: Node, position: Vector2D, factor = 1) {
        super()
        this.node = node
        this.position = position
        this.factor = factor
    }
    public Awake(): void {
        super.Awake()
        this.node.Awake()
    }

    public Update(deltaTime: number): void {
        super.Update(deltaTime)
        const { Start, End, Index } = Node.NodeArgsFromIndex(this.position)
        this.node.UpdatePosition(Start, End, Index)
        this.node.Update(deltaTime, () => this.node.Resize(this.factor))
    }

    public Clear(): void {
        this.node.Clear()
    }

    public get Node(): Node {
        return this.node
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
        const { Start, End, Index } = Node.NodeArgsFromIndex(Vector2D.Origin)
        this.head = new SnakePart(
            new Node(
                Start,
                End,
                Index,
                undefined,
                HeadImg,
                CanvasLayer.Foreground
            ),
            Index
        )
        this.head.Awake()
    }

    private UpdateHead(): void {
        const img = this.head.Node.Image
        if (!img) {
            return
        }
        switch (this.direction) {
            case DIRECTION.LEFT:
                img.src = SNAKE.HEAD.LEFT
                break
            case DIRECTION.UP:
                img.src = SNAKE.HEAD.UP
                break
            case DIRECTION.RIGHT:
                img.src = SNAKE.HEAD.RIGHT
                break
            case DIRECTION.DOWN:
                img.src = SNAKE.HEAD.DOWN
        }
    }
    public Update(deltaTime: number): void {
        super.Update(deltaTime)
        this.UpdateHead()
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
                part.Clear()
                if (this.head.position.equals(part.position)) {
                    // Handle Collision
                    this.gameState.Over()
                    break
                }
                const tempPos = part.position
                part.position = lastPos
                lastPos = tempPos
            }
        } else {
            this.deltaTimeSinceLastUpdate += deltaTime
        }
        this.head.Update(deltaTime)
        this.tail.forEach((part) => part.Update(deltaTime))
    }

    public isIndexAtSnake(index: Vector2D): boolean {
        return (
            this.isIndexAtHead(index) ||
            (!!this.tail.length &&
                !!this.tail.find((part) => part.Node.Index.equals(index)))
        )
    }

    public isIndexAtHead(index: Vector2D): boolean {
        return this.head?.Node.Index.equals(index)
    }

    public Eat(): void {
        const { Start, End, Index } = Node.NodeArgsFromIndex(
            new Vector2D(this.head.position.x, this.head.position.y)
        )
        const part = new SnakePart(
            new Node(
                Start,
                End,
                Index,
                undefined,
                TailImg,
                CanvasLayer.Foreground
            ),
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
        this.head.Clear()
        this.tail.forEach((part) => part.Clear())
        this.tail = []
        this.Awake()
    }
}
