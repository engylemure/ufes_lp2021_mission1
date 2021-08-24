import { IComponent, Vector2D } from '@/utils'
import { Interface } from '@/game/interface'
import { RenderLayer } from '@/render-layer'
import { Settings } from '@/settings'
import prettyMs from 'pretty-ms'
import { Root } from '@/utils/root'
import { GameState } from '@/game/components'

type Style = { [key: string]: number | string }

export class InterfaceDrawComponent implements IComponent {
    public Entity: Interface
    private _scoreElm: HTMLDivElement
    private _timeElm: HTMLDivElement
    private _fpsElm: HTMLDivElement
    private _menuWrapperElm: HTMLDivElement
    private _menuElm: HTMLDivElement
    private _maxScoreElm: HTMLDivElement
    private _saveButtonElm: HTMLButtonElement
    private _loadButtonElm: HTMLButtonElement
    private _restartButtonElm: HTMLButtonElement
    private _resumeButtonElm: HTMLButtonElement
    private _savedDataElm: HTMLDivElement

    private restartButtonElm(): HTMLButtonElement {
        const restart = document.createElement('button')
        this.applyStyleObject(restart, this.buttonStyle(true))
        restart.innerText = 'Restart'
        this._restartButtonElm = restart
        restart.onclick = () => this.Entity.Restart()
        return restart
    }

    private resumeButtonElm(): HTMLButtonElement {
        const resume = document.createElement('button')
        this.applyStyleObject(resume, this.buttonStyle(true))
        resume.innerText = 'Resume'
        this._resumeButtonElm = resume
        resume.onclick = () => this.Entity.Resume()
        return resume
    }

    private loadButtonElm(): HTMLButtonElement {
        const load = document.createElement('button')
        this.applyStyleObject(load, this.buttonStyle(true))
        load.innerText = 'Load'
        load.disabled = true
        this._loadButtonElm = load
        load.onclick = () => this.Entity.Load()
        return load
    }

    buttonStyle(hasColor = false): Style {
        return {
            fontSize: '1rem',
            height: '2rem',
            width: '50%',
            margin: '1rem',
            borderRadius: '4px',
            backgroundColor: hasColor ? 'rgba(255, 204, 153, 1)' : '',
            boxShadow: hasColor ? '0 0 1px grey' : '',
        }
    }
    private saveButtonElm(): HTMLButtonElement {
        const save = document.createElement('button')
        this.applyStyleObject(save, this.buttonStyle(true))
        save.innerText = 'Save'
        this._saveButtonElm = save
        save.onclick = () => this.Entity.Save()
        return save
    }

    private maxScoreElm(): HTMLDivElement {
        const maxScore = document.createElement('div')
        this.applyStyleObject(maxScore, {
            ...this.buttonStyle(),
            fontSize: '1.5rem',
            textAlign: 'center',
        })
        this._maxScoreElm = maxScore
        return maxScore
    }

    private savedDataElm(): HTMLDivElement {
        const savedData = document.createElement('div')
        this.applyStyleObject(savedData, {
            ...this.buttonStyle(),
            textAlign: 'center',
        })
        this._savedDataElm = savedData
        return savedData
    }

    private createMenuElm(): HTMLDivElement {
        const menu = document.createElement('div')
        this.applyStyleObject(menu, {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '4px',
            border: '1px solid grey',
            zIndex: '4',
            height: '50%',
            width: '50%',
            boxShadow: '0 0 4px grey',
            background: 'white',
            alignItems: 'center',
        })
        this._menuElm = menu
        menu.appendChild(this.maxScoreElm())
        menu.appendChild(this.resumeButtonElm())
        menu.appendChild(this.saveButtonElm())
        menu.appendChild(this.savedDataElm())
        menu.appendChild(this.loadButtonElm())
        menu.appendChild(this.restartButtonElm())
        menu.onclick = (ev) => ev.stopPropagation()
        return menu
    }

    private onWrapperPress(): void {
        if (this.Entity.isPaused) {
            this.Entity.Resume()
        } else {
            this.Entity.Pause()
        }
    }

    private createMenuWrapperElm(): HTMLDivElement {
        const menuWrapper = document.createElement('div')
        menuWrapper.style.position = 'absolute'
        menuWrapper.style.display = 'flex'
        menuWrapper.style.alignItems = 'center'
        menuWrapper.style.justifyContent = 'center'
        menuWrapper.style.height = '100%'
        menuWrapper.style.width = '100%'
        menuWrapper.appendChild(this.createMenuElm())
        this._menuWrapperElm = menuWrapper
        menuWrapper.onclick = this.onWrapperPress.bind(this)
        return menuWrapper
    }

    private applyStyleObject(node: HTMLElement, style: Style): void {
        Object.entries(style).forEach(
            ([key, value]) => (node.style[key] = value)
        )
    }

    divStyle(marginTop: string = '3%'): Style {
        return {
            fontSize: '1rem',
            fontWeight: 'bold',
            zIndex: '100',
            marginLeft: '10%',
            marginTop,
            position: 'absolute',
            borderRadius: '4px',
            border: '1px solid grey',
            background: 'rgba(255, 204, 153, 1)',
            padding: '0.2% 0.6%',
            width: '8%',
            boxShadow: '0 0 4px grey',
        }
    }

    constructor() {
        const score = document.createElement('div')
        this.applyStyleObject(score, this.divStyle())
        const time = document.createElement('div')
        this.applyStyleObject(time, this.divStyle('5%'))
        const fps = document.createElement('div')
        this.applyStyleObject(fps, this.divStyle('7%'))
        this._scoreElm = score
        this._timeElm = time
        this._fpsElm = fps
        RenderLayer.Root.AddElement(
            this.createMenuWrapperElm(),
            score,
            time,
            fps
        )
    }

    public Awake(): void {
        this.Clear()
    }

    public Update(deltaTime: number): void {
        this.Clear()
        this._scoreElm.innerText = `SCORE: ${this.Entity.Score}`
        this._timeElm.innerText = `TIME: ${prettyMs(this.Entity.GameTime, {
            secondsDecimalDigits: 2,
        })}`
        this._fpsElm.innerText = `FPS: ${this.Entity.FPS.toFixed(2)}`
        if (this.Entity.isPaused) {
            this._menuElm.style.display = 'flex'
        } else {
            this._menuElm.style.display = 'none'
        }
        const savedData = this.Entity.SavedData
        if (savedData) {
            this._loadButtonElm.disabled = false
            this._savedDataElm.innerText = `Score: ${
                savedData.gameData.score
            }, Time: ${prettyMs(savedData.gameData.matchTime, {
                secondsDecimalDigits: 2,
            })}`
        } else {
            this._loadButtonElm.disabled = true
            this._savedDataElm.innerText = 'No saved data'
        }
        this._maxScoreElm.innerText = `Highest Score: ${this.Entity.HighestScore}`
    }

    private Clear(): void {}
}

declare global {
    interface CSSStyleDeclaration {
        [index: string]: any
    }
}
