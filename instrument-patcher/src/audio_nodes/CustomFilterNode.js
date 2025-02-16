import { CustomAudioNode } from './CustomAudioNode';
export class CustomFilterNode extends CustomAudioNode {
    constructor(context, options = {}) {
        super(context);
        Object.defineProperty(this, "filter", {
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
        //** convert to array of inputs? */
        // inputs: GainNode[];
        Object.defineProperty(this, "output", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        //** convert to array of inputs? */
        // this.inputs = [new GainNode(context)];
        this.input = new GainNode(context);
        this.output = new GainNode(context);
        this.filter = new BiquadFilterNode(context);
        this.filter.type = options.type ?? 'lowpass';
        this.filter.frequency.value = options.frequency ?? 350;
        this.filter.Q.value = options.Q ?? 1;
        this.input.connect(this.filter);
        this.filter.connect(this.output);
        this.initialized = true;
        // console.log('CustomFilterNode initialized');
    }
    async _init() {
        // No additional initialization required
    }
    set type(value) {
        this.filter.type = value;
    }
    get type() {
        return this.filter.type;
    }
    // set frequency(value: number) {
    //     this.filter.frequency.value = value;
    // }
    get frequency() {
        return this.filter.frequency;
    }
    // set Q(value: number) {
    //     this.filter.Q.value = value;
    // }
    get Q() {
        return this.filter.Q;
    }
}
