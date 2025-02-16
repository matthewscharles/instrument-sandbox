import { CustomAudioNode } from './CustomAudioNode';
export class CustomOscillatorNode extends CustomAudioNode {
    constructor(context, options = {}) {
        super(context);
        Object.defineProperty(this, "oscillator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        this.input = new GainNode(context);
        this.output = new GainNode(context);
        this.oscillator = new OscillatorNode(context);
        this.oscillator.type = options.type ?? 'sine';
        this.oscillator.frequency.value = options.frequency ?? 440;
        this.oscillator.connect(this.output);
        this.oscillator.start();
        this.initialized = true;
    }
    async _init() {
        // No additional initialization required
    }
    set type(value) {
        this.oscillator.type = value;
    }
    get type() {
        return this.oscillator.type;
    }
    get frequency() {
        return this.oscillator.frequency;
    }
}
