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
    feedback: GainNode;
    delay: DelayNode;
    input: GainNode;
    delayTime: number;
    feedbackValue: number;
    
    constructor(context: AudioContext, options: EchoNodeOptions = {}){
        
        this.context = context;
        this.initialized = false;
        
        if(typeof options.delayTime != 'undefined'){
            this.delayTime = options.delayTime;
        } else {
            this.delayTime = 0.5;
        }
        
        this.feedbackValue = 0.5;
        
        if(typeof options.feedback != 'undefined'){
            this.feedbackValue = options.feedback;
        }
        
        this.input = new GainNode(context);
        this.delay = new DelayNode(context, { delayTime:this.delayTime });
        this.feedback = new GainNode(context, { gain: this.feedbackValue });
        this.output = new GainNode(context);
        
        this.input.connect(this.delay);
        this.delay.connect(this.feedback);
        this.feedback.connect(this.delay);
        this.delay.connect(this.output);
    }
    
    connect(destination: AudioNode | AudioParam){
        if (destination instanceof AudioNode || destination instanceof AudioParam) {
            this.output.connect(destination);
        } else {
            console.error('Destination must be an AudioNode or AudioParam.');
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