import * as Tone from 'tone'
import { IComponent } from '@/utils'
import { Snake } from '@/snake'
import { GameState, GAME_EVENTS } from '@/game'

enum Notes {
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    A = 'A',
    B = 'B',
}

export class SnakeAudioComponent implements IComponent {
    private hasToneStarted = false
    private synth?: Tone.Synth<Tone.SynthOptions>

    constructor(private readonly gameState: GameState) {
        gameState.onEvent(GAME_EVENTS.START, this.InitializeTone.bind(this))
        gameState.onEvent(GAME_EVENTS.EAT, this.eatSound.bind(this))
        gameState.onEvent(GAME_EVENTS.OVER, this.overSound.bind(this))
        if (!window.__DEV__) {
            this.synth = new Tone.Synth().toDestination()
        }
    }

    Update(deltaTime: number): void {}

    Awake(): void {}

    private getNote(): Notes {
        switch (this.gameState.Score % 7) {
            case 1:
                return Notes.D
            case 2:
                return Notes.E
            case 3:
                return Notes.F
            case 4:
                return Notes.G
            case 5:
                return Notes.A
            case 6:
                return Notes.B
            default:
                return Notes.C
        }
    }

    private overSound(): void {
        const now = Tone.now()
        this.synth?.triggerAttack(`${this.getNote()}3`, now)
        this.synth?.triggerRelease(now + 0.5)
    }

    private eatSound(): void {
        const now = Tone.now()
        this.synth?.triggerAttack(`${Notes.C}4`, now)
        this.synth?.triggerRelease(now + 0.05)
    }

    private async InitializeTone(): Promise<void> {
        if (!this.hasToneStarted) {
            await Tone.start()
            this.hasToneStarted = true
        }
    }

    public Entity: Snake
}
