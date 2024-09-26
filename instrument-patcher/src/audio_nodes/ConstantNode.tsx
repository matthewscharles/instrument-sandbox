// import { AudioContext } from 'standardized-audio-context';

import { connect, disconnect } from './audioNodeMethods';

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
        this.initialized = true;    // synchronous initialization

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
    
    connect(destination: AudioNode | AudioParam | AudioDestinationNode) {
        connect(this, this.output, destination);
    }

    disconnect(destination?: AudioNode | AudioParam, outputIndex: number = 0, inputIndex: number = 0) {
        disconnect(this, this.output, destination, outputIndex, inputIndex);
    }
    
}