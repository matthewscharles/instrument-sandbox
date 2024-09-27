import { CustomAudioNode } from './CustomAudioNode';

interface ConstantNodeOptions {
    value?: number;
}

export class ConstantNode extends CustomAudioNode{
    context: AudioContext;
    initialized: boolean;
    node!: AudioWorkletNode;
    input: GainNode;
    output: ConstantSourceNode;
    
    constructor(context: AudioContext, options: ConstantNodeOptions = {}){
        super();
        this.context = context;
        this.initialized = true;

        this.input = new GainNode(context);
        this.output =  new ConstantSourceNode(context, { offset: 0 });
        this.output.start();
        this.input.connect(this.output.offset);
    }
    
    get value(){
        return this.output;
    }
    
}