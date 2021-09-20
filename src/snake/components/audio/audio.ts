import { IComponent } from '@/utils'
import { Snake } from '@/snake'
import { GameState, GAME_EVENTS } from '@/game'

enum Notes {
    C = 261.6,
    D = 293.7,
    E = 329.6,
    F = 349.2,
    G = 392.0,
    A = 440.0,
    B = 493.9,
}

class Synth {
    private context: AudioContext
    private oscillator: OscillatorNode
    private contextGain: GainNode

    constructor(private frequency: number) {
        this.context = new AudioContext()
        this.oscillator = this.context.createOscillator()
        this.contextGain = this.context.createGain()
        this.oscillator.frequency.value = frequency
        this.oscillator.type = 'sine'
        this.oscillator.connect(this.contextGain)
        this.contextGain.connect(this.context.destination)
    }

    start() {
        this.oscillator.start(0)
    }

    stop(x = 0.1) {
        this.contextGain.gain.exponentialRampToValueAtTime(
            0.00001,
            this.context.currentTime + x
        )
    }
}

export class SnakeAudioComponent implements IComponent {
    private hasToneStarted = false

    constructor(private readonly gameState: GameState) {
        gameState.onEvent(GAME_EVENTS.START, this.InitializeTone.bind(this))
        gameState.onEvent(GAME_EVENTS.EAT, this.eatSound.bind(this))
        gameState.onEvent(GAME_EVENTS.OVER, this.overSound.bind(this))
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
        const synth = new Synth(this.getNote())
        synth.start()
        synth.stop(5)
    }

    private eatSound(): void {
        const synth = new Synth(Notes.C)
        synth.start()
        synth.stop()
    }

    private async InitializeTone(): Promise<void> {
        // if (!this.hasToneStarted) {
        //     await Tone.start()
        //     this.hasToneStarted = true
        // }
    }

    public Entity: Snake
}
