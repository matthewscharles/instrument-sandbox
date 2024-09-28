import { CustomAudioNode } from './CustomAudioNode';

interface EchoNodeOptions {
    delayTime?: number;
    feedback?: number;
}

export class EchoNode extends CustomAudioNode {
    delay: DelayNode;
    input: GainNode;
    delayTime: number;
    feedbackValue: number;
    _feedback: GainNode;
    _time: GainNode;

    constructor(context: AudioContext, options: EchoNodeOptions = {}) {
        super(context);
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
        // console.log('EchoNode initialized');
    }

    protected async _init() {
        // No additional initialization required
    }

    get time() {
        return this._time;
    }

    get feedback() {
        return this._feedback.gain;
    }

}