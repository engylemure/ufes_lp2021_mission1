import { IUpdate } from '../lifecycle'
import { IComponent } from './component.h'

type Constr<C> = { new (...args: any[]): C }

export abstract class Entity implements IUpdate {
    protected _components: IComponent[] = []

    public get Components(): IComponent[] {
        return this._components
    }

    public AddComponent(component: IComponent): void {
        this._components.push(component)
        component.Entity = this
    }

    public GetComponent<C extends IComponent>(constr: Constr<C>): C {
        for (const component of this._components) {
            if (component instanceof constr) {
                return component as C
            }
        }
        throw new Error(
            `Component ${constr.name} not found on Entity ${this.constructor.name}`
        )
    }

    public RemoveComponent<C extends IComponent>(constr: Constr<C>): void {
        let toRemove: IComponent | undefined
        let index: number | undefined

        for (let i = 0; i < this._components.length; i++) {
            const component = this._components[i]
            if (component instanceof constr) {
                toRemove = component
                index = i
                break
            }
        }

        if (toRemove && index) {
            toRemove.Entity = null
            this._components.splice(index, 1)
        }
    }

    public HasComponent<C extends IComponent>(constr: Constr<C>): boolean {
        for (const component of this._components) {
            if (component instanceof constr) {
                return true
            }
        }

        return false
    }

    public Awake(): void {
        for (const component of this._components) {
            component.Awake()
        }
    }

    public Update(deltaTime: number): void {
        for (const component of this._components) {
            component.Update(deltaTime)
        }
    }
}
