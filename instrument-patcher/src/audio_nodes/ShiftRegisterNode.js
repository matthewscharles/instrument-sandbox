import { CustomAudioNode } from './CustomAudioNode';
class ShiftRegisterNode extends CustomAudioNode {
    constructor(context, options = {}) {
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
        Object.defineProperty(this, "registers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "numStages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onRegistersUpdated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.input = new GainNode(this.context);
        this.trigger = new GainNode(this.context);
        this.initialized = false;
        this.initPromise = this._init(); // Start async init
        const { numStages = 8, onRegistersUpdated = null } = options;
        this.numStages = numStages;
        this.onRegistersUpdated = onRegistersUpdated;
    }
    async _init() {
        await this.context.audioWorklet.addModule('./audio-processors/shift-register-processor.js');
        this.node = new AudioWorkletNode(this.context, 'shift-register-processor', {
            numberOfInputs: 2,
            numberOfOutputs: this.numStages,
            channelCount: 1,
            outputChannelCount: new Array(this.numStages).fill(1),
            processorOptions: {
                numStages: this.numStages,
            },
        });
        this.input.connect(this.node, 0, 0);
        this.trigger.connect(this.node, 0, 1);
        this.registers = new Array(this.numStages).fill(0);
        this.node.port.onmessage = (event) => {
            if (event.data.registers) {
                this.registers = event.data.registers;
                if (this.onRegistersUpdated) {
                    this.onRegistersUpdated(this.registers.slice());
                }
            }
        };
        this.initialized = true;
    }
    getRegisters() {
        return this.registers.slice();
    }
}
export { ShiftRegisterNode };
