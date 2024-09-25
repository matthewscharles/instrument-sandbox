// import { AudioContext } from 'standardized-audio-context';

interface ConstantNodeOptions {
    value?: number;
}

export class ConstantNode{
    context: AudioContext;
    initialized: boolean;
    node!: AudioWorkletNode;
    output!: AudioNode;
    input: GainNode;
    _value: ConstantSourceNode;
    
    constructor(context: AudioContext, options: ConstantNodeOptions = {}){
        
        this.context = context;
        this.initialized = false;

        this.input = new GainNode(context);
        this.output = new GainNode(context);
        this._value =  new ConstantSourceNode(context, { offset: 0 });
        this._value.start();
        this.input.connect(this._value.offset);
        this._value.connect(this.output);    
    }
    
    get value(){
        return this._value;
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