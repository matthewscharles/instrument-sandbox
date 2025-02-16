import { CustomAudioNode } from './CustomAudioNode';
export class EventReceiverNode extends CustomAudioNode {
    constructor(context, options) {
        super(context);
        Object.defineProperty(this, "context", {
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
        Object.defineProperty(this, "_eventName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_interval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eventListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_previousEventName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "handleTrigger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.context = context;
        this._eventName = options.eventName;
        this._interval = options.interval || 50;
        this.output = new ConstantSourceNode(context, { offset: 0 });
        this.output.start();
        this.eventListener = this.handleEvent.bind(this);
        this.setupEventListener();
    }
    setupEventListener() {
        if (this._previousEventName) {
            window.removeEventListener(this._previousEventName, this.eventListener);
        }
        // console.log('setting up event listener', this._eventName, this.eventListener);
        window.addEventListener(this._eventName, this.eventListener);
        var event = new CustomEvent('defaultEvent');
        window.dispatchEvent(event);
        this._previousEventName = this._eventName;
    }
    handleEvent(event) {
        console.log('received event', event);
        let valueToSet = 1;
        if (event.detail && event.detail.value !== undefined) {
            valueToSet = event.detail.value;
        }
        const now = this.context.currentTime;
        this.output.offset.setValueAtTime(valueToSet, now);
        this.output.offset.setValueAtTime(0, now + this._interval / 1000);
        if (this.handleTrigger) {
            this.handleTrigger();
        }
    }
    get eventName() {
        return this._eventName;
    }
    set eventName(value) {
        if (this._eventName !== value) {
            this._eventName = value;
            this.setupEventListener();
        }
    }
    get interval() {
        return this._interval;
    }
    set interval(value) {
        this._interval = value;
    }
    destroy() {
        window.removeEventListener(this._eventName, this.eventListener);
    }
}
