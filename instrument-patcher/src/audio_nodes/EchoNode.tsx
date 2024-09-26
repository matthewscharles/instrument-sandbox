// import { AudioContext } from 'standardized-audio-context';

interface EchoNodeOptions {
    delayTime?: number;
    feedback?: number;
}

export class EchoNode{
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
    
    constructor(context: AudioContext, options: EchoNodeOptions = {}){
        
        this.context = context;
        this.initialized = false;
        
        if(typeof options.delayTime != 'undefined'){
            this.delayTime = options.delayTime;
        } else {
            this.delayTime = 0;
        }
        
        this.feedbackValue = 0;
        
        if(typeof options.feedback != 'undefined'){
            this.feedbackValue = options.feedback;
        }
        
        this.input = new GainNode(context);
        this.delay = new DelayNode(context, { delayTime:this.delayTime });
        
        this._time = new GainNode(context);
        this._time.connect(this.delay.delayTime);
        this._feedback = new GainNode(context, { gain: this.feedbackValue });
        
        this.output = new GainNode(context);
        
        this.input.connect(this.delay);
        this.delay.connect(this.feedback);
        this._feedback.connect(this.delay);
        this.delay.connect(this.output);
    }

    get time(){
        return this._time;
    }
    
    get feedback(){
        return this._feedback.gain;
    }
    
    connect(destination: AudioNode | AudioParam | AudioDestinationNode){
        if (destination instanceof AudioDestinationNode){
            console.log('destination is AudioDestinationNode', destination);
            this.output.connect(destination);
        } else if (destination instanceof AudioNode){
            this.output.connect(destination);
        } else if (destination instanceof AudioParam){
            this.output.connect(destination);
        } else {
            console.error('Destination must be an AudioNode, AudioParam, or AudioDestinationNode.');
        }
        
    }
    
    
    disconnect(destination: AudioNode | AudioParam, outputIndex:number = 0, inputIndex: number = 0){
        if (!destination) {
            this.output.disconnect();
        } else {
            if (destination instanceof AudioParam) {
                this.output.disconnect(destination, outputIndex);
            } else if (destination instanceof AudioNode) {
                this.output.disconnect(destination, outputIndex, inputIndex);
            } else {
                console.error('Destination must be an AudioNode or AudioParam.');
            }
        }
    }
    
}