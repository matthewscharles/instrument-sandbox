import { CustomAudioNode } from './CustomAudioNode';
export class EchoNode extends CustomAudioNode {
    constructor(context, options = {}) {
        super(context);
        Object.defineProperty(this, "delay", {
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
        Object.defineProperty(this, "delayTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "feedbackValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_feedback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_time", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.delayTime = options.delayTime ?? 0;
        this.feedbackValue = options.feedback ?? 0;
        this.input = new GainNode(context);
        this.delay = new DelayNode(context, { delayTime: this.delayTime });
        this._time = new GainNode(context);
        this._time.connect(this.delay.delayTime);
        this._feedback = new GainNode(context, { gain: this.feedbackValue });
        this.output = new GainNode(context);
        this.input.connect(this.delay);
        this.delay.connect(this._feedback);
        this._feedback.connect(this.delay);
        this.delay.connect(this.output);
        this.initialized = true;
    }
    async _init() {
        // No additional initialization required
    }
    get time() {
        return this._time;
    }
    get feedback() {
        return this._feedback.gain;
    }
}
