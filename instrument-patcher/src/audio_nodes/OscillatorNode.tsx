import { CustomAudioNode } from './CustomAudioNode';

interface OscillatorNodeOptions {
    type?: OscillatorType;
    frequency?: number;
}

export class CustomOscillatorNode extends CustomAudioNode {
    oscillator: OscillatorNode;
    input: GainNode;
    output: GainNode;

    constructor(context: AudioContext, options: OscillatorNodeOptions = {}) {
        super(context);

        this.input = new GainNode(context);
        this.output = new GainNode(context);

        this.oscillator = new OscillatorNode(context);
        this.oscillator.type = options.type ?? 'sine';
        this.oscillator.frequency.value = options.frequency ?? 440;

        this.oscillator.connect(this.output);
        this.oscillator.start();

        this.initialized = true;
    }

    protected async _init() {
        // No additional initialization required
    }

    set type(value: OscillatorType) {
        this.oscillator.type = value;
    }

    get type() {
        return this.oscillator.type;
    }

    // set frequency(value: number) {
    //     this.oscillator.frequency.value = value;
    // }

    get frequency() {
        return this.oscillator.frequency;
    }

}