import { IComponent, Vector2D } from '@/utils'
import { Interface } from '@/game/interface'
import { RenderLayer } from '@/render-layer'
import { Settings } from '@/settings'
import prettyMs from 'pretty-ms'
import { Root } from '@/utils/root'

export class InterfaceDrawComponent implements IComponent {
    public Entity: Interface
    private _scoreElm: HTMLDivElement
    private _timeElm: HTMLDivElement
    private _fpsElm: HTMLDivElement
    private _menuWrapperElm: HTMLDivElement
    private _menuElm: HTMLDivElement

    private createMenuElm(): void {
        const menuWrapper = document.createElement('div')
        menuWrapper.style.position = 'absolute'
        menuWrapper.style.display = 'flex'
        menuWrapper.style.alignItems = 'center'
        menuWrapper.style.justifyContent = 'center'
        menuWrapper.style.height = '100%'
        menuWrapper.style.width = '100%'
        const menu = document.createElement('div')
        menu.style.borderRadius = '4px';
        menu.style.border = '1px solid grey'
        menu.style.zIndex = '4'
        menu.style.height = `50%`
        menu.style.width = `50%`
        menu.style.boxShadow = '0 0 1em grey'
        menu.style.background = 'white'
        menuWrapper.appendChild(menu)
        this._menuWrapperElm = menuWrapper
        this._menuElm = menu
        RenderLayer.Root.AddElement(menuWrapper)
    }
    constructor() {
        this.createMenuElm()
        const score = document.createElement('div')
        score.style.zIndex = '4'
        const time = document.createElement('div')
        time.style.zIndex = '4'
        const fps = document.createElement('div')
        fps.style.zIndex = '4'
        this._scoreElm = score
        this._timeElm = time
        this._fpsElm = fps
        RenderLayer.Root.AddElement(score, time, fps)
    }

    public Awake(): void {
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        this._scoreElm.innerText = `Score: ${this.Entity.Score}`
        this._timeElm.innerText = `Time: ${prettyMs(
                    this.Entity.GameTime,
                    { secondsDecimalDigits: 2 }
                )}`
        this._fpsElm.innerText = `FPS: ${prettyMs(
            this.Entity.FPS,
            { secondsDecimalDigits: 2 }
        )}`
        if (this.Entity.isPaused) {
            this._menuElm.style.display = 'flex'
        } else {
            this._menuElm.style.display = 'none'
        }
        // this._menuElm.innerText = this.Entity.isPaused.toString()
    }

    private Clear(): void {
    }
}