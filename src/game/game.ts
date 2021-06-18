import { Entity } from '@/utils'
import { Grid } from '@/grid'

export class Game extends Entity {
    private _lastTimestamp = 0
    private _entities: Entity[] = []

    public get Entities(): Entity[] {
        return this._entities
    }

    constructor() {
        super()
        // start update loop
        this.Update()
    }

    public Awake(): void {
        super.Awake()
        this._entities.push(new Grid())
        for (const entity of this.Entities) {
            entity.Awake()
        }
        window.requestAnimationFrame(() => {
            this._lastTimestamp = Date.now()
            this.Update()
        })
    }

    public Update(): void {
        const deltaTime = (Date.now() - this._lastTimestamp) / 1000
        super.Update(deltaTime)
        for (const entity of this.Entities) {
            entity.Update(deltaTime)
        }
        window.requestAnimationFrame(() => {
            this._lastTimestamp = Date.now()
            this.Update()
        })
    }
}
