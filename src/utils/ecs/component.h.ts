import { IAwake, IUpdate } from '../lifecycle'
import { Entity } from './entity'

export interface IComponent extends IUpdate, IAwake {
    Entity: Entity | null
}
