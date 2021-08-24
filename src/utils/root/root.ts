import { IAwake } from '../lifecycle'
import { Vector2D } from '../vector2D'

export class Root implements IAwake {
    private _elm: HTMLDivElement
    constructor(public Size: Vector2D) {}
    public get Elm(): HTMLDivElement {
        return this._elm
    }
    public Awake(): void {
        const elem = document.createElement('div')
        elem.id = 'root-elm'
        document.body.style.height = '100%'
        document.body.style.minHeight = '100%'
        document.body.style.width = '100%'
        document.body.style.minWidth = '100%'
        elem.style.height = '100%'
        elem.style.minHeight = '100%'
        elem.style.width = '100%'
        elem.style.minWidth = '100%'
        document.body.appendChild(elem)
        this._elm = elem
    }

    AddElement(...elms: Node[]) {
        elms.forEach((elm) => this._elm.appendChild(elm))
    }
}
