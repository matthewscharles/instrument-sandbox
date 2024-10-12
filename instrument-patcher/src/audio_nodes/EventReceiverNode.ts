import { CustomAudioNode } from './CustomAudioNode';

interface EventReceiverNodeOptions {
    eventName: string;
    interval?: number; // ms
}

export class EventReceiverNode extends CustomAudioNode {
    context: AudioContext;
    output: ConstantSourceNode;
    private _eventName: string;
    private _interval: number;
    private eventListener: (event: any) => void;
    private _previousEventName?: string;
    handleTrigger?: () => void;

    constructor(context: AudioContext, options: EventReceiverNodeOptions) {
        super(context);
        this.context = context;
        this._eventName = options.eventName;
        this._interval = options.interval || 50;

        this.output = new ConstantSourceNode(context, { offset: 0 });
        this.output.start();

        this.eventListener = this.handleEvent.bind(this);

        this.setupEventListener();
    }

    private setupEventListener() {
        if (this._previousEventName) {
            window.removeEventListener(this._previousEventName, this.eventListener);
        }

        window.addEventListener(this._eventName, this.eventListener);
        this._previousEventName = this._eventName;
    }

    private handleEvent(event: any) {
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

    set eventName(value: string) {
        if (this._eventName !== value) {
            this._eventName = value;
            this.setupEventListener();
        }
    }

    get interval() {
        return this._interval;
    }

    set interval(value: number) {
        this._interval = value;
    }

    destroy() {
        window.removeEventListener(this._eventName, this.eventListener);
    }
}