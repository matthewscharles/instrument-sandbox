import { CustomAudioNode } from './CustomAudioNode';
class SampleHoldNode extends CustomAudioNode {
    constructor(context) {
        super(context);
        Object.defineProperty(this, "input", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "trigger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.input = new GainNode(context);
        this.trigger = new GainNode(context);
        this.initialized = false;
        this.initPromise = this.initialize(); // Start async init
    }
    async initialize() {
        await this.context.audioWorklet.addModule('./audio-processors/sample-hold-processor.js');
        this.node = new AudioWorkletNode(this.context, 'sample-hold-processor', {
            numberOfInputs: 2,
            numberOfOutputs: 1,
            channelCount: 1, // Mono processing
        });
        this.input.connect(this.node, 0, 0); // Connect to input 0 (signal)
        this.trigger.connect(this.node, 0, 1); // Connect to input 1 (trigger)
        this.output = this.node;
        this.initialized = true;
    }
}
export { SampleHoldNode };
