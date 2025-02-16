import { CustomAudioNode } from './CustomAudioNode';
export class CustomGainNode extends CustomAudioNode {
    constructor(context, options = {}) {
        super(context);
        Object.defineProperty(this, "input", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "output", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.input = new GainNode(context, { gain: 0 });
        this.output = new GainNode(context);
        this.input.connect(this.output);
        this.initialized = true;
    }
    async _init() {
        // No additional initialization required
    }
    get gain() {
        return this.input.gain;
    }
}
