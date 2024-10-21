import { CustomAudioNode } from './CustomAudioNode';

interface GainNodeOptions {
    gain?: number;
}

export class CustomGainNode extends CustomAudioNode {
    input: GainNode;
    output: GainNode;

    constructor(context: AudioContext, options: GainNodeOptions = {}) {
        super(context);
        console.log(options);
        this.input = new GainNode(context, {gain: 0});
        this.output = new GainNode(context);

        this.input.connect(this.output);

        this.initialized = true;
    }

    protected async _init() {
        // No additional initialization required
    }


    get gain(): AudioParam {
        return this.input.gain;
    }

    
}