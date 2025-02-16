import { CustomAudioNode } from './CustomAudioNode';
export class ConstantNode extends CustomAudioNode {
    constructor(context, options = {}) {
        super(context);
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "initialized", {
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
        this.context = context;
        this.initialized = true;
        this.input = new GainNode(context);
        this.output = new ConstantSourceNode(context, { offset: 0 });
        this.output.start();
        this.input.connect(this.output.offset);
    }
    get value() {
        return this.output;
    }
}
