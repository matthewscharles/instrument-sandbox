interface EchoNodeOptions {
    delayTime?: number;
    feedback?: number;
}

export class EchoNode {
    context: AudioContext;
    initialized: boolean;
    node!: AudioWorkletNode;
    output!: AudioNode;
    delay: DelayNode;
    input: GainNode;
    delayTime: number;
    feedbackValue: number;
    _feedback: GainNode;
    _time: GainNode;

    constructor(context: AudioContext, options: EchoNodeOptions = {}) {
        this.context = context;
        this.initialized = false;

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

        this.initialized = true; // Mark as initialized
        console.log('EchoNode initialized');
    }

    get time() {
        return this._time;
    }

    get feedback() {
        return this._feedback.gain;
    }

    connect(destination: AudioNode | AudioParam | AudioDestinationNode) {
        if (!this.initialized) {
            console.log('Node not initialized');
            return;
        }
        console.log('Connecting EchoNode to destination', destination);
        if (destination instanceof AudioDestinationNode) {
            console.log('Destination is AudioDestinationNode', destination);
            this.output.connect(destination);
        } else if (destination instanceof AudioNode) {
            this.output.connect(destination);
        } else if (destination instanceof AudioParam) {
            this.output.connect(destination);
        }
    }

    disconnect(destination?: AudioNode | AudioParam, outputIndex: number = 0, inputIndex: number = 0) {
        if (!this.initialized) {
            console.log('Node not initialized');
            return;
        }
        console.log('Disconnecting EchoNode from destination', destination);
        this.output.disconnect(destination, outputIndex, inputIndex);
    }
}