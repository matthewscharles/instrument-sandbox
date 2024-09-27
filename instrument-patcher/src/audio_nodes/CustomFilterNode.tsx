import { CustomAudioNode } from './CustomAudioNode';

interface FilterNodeOptions {
    type?: BiquadFilterType;
    frequency?: number;
    Q?: number;
}

export class CustomFilterNode extends CustomAudioNode {
    filter: BiquadFilterNode;
    input: GainNode;
    output: GainNode;

    constructor(context: AudioContext, options: FilterNodeOptions = {}) {
        super(context);

        this.input = new GainNode(context);
        this.output = new GainNode(context);

        this.filter = new BiquadFilterNode(context);
        this.filter.type = options.type ?? 'lowpass';
        this.filter.frequency.value = options.frequency ?? 350;
        this.filter.Q.value = options.Q ?? 1;

        this.input.connect(this.filter);
        this.filter.connect(this.output);

        this.initialized = true;
        console.log('CustomFilterNode initialized');
    }

    protected async _init() {
        // No additional initialization required
    }

    set type(value: BiquadFilterType) {
        this.filter.type = value;
    }

    get type() {
        return this.filter.type;
    }

    // set frequency(value: number) {
    //     this.filter.frequency.value = value;
    // }

    get frequency(): AudioParam {
        return this.filter.frequency;
    }

    // set Q(value: number) {
    //     this.filter.Q.value = value;
    // }

    get Q(): AudioParam {
        return this.filter.Q;
    }

}