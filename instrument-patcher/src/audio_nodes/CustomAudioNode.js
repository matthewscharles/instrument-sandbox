import { connect, disconnect } from './audioNodeMethods';
export class CustomAudioNode {
    constructor(context) {
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
        Object.defineProperty(this, "initPromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "node", {
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
        this.initialized = false;
        this.initPromise = this._init();
    }
    async _init() {
        this.initialized = true;
    }
    async connect(destination) {
        await connect(this, this.output, destination);
    }
    async disconnect(destination, outputIndex = 0, inputIndex = 0) {
        await disconnect(this, this.output, destination, outputIndex, inputIndex);
    }
}
