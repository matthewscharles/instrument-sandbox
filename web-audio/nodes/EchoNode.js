export class EchoNode{
    constructor(context, options = {}){
        
        this.context = context;
        this.initialized = false;
        
        if(typeof options.delayTime != 'undefined'){
            this.delayTime = options.delayTime;
        } else {
            this.delayTime = 0.5;
        }
        
        if(typeof options.feedback != 'undefined'){
            this.feedback = options.feedback;
        } else {
            this.feedback = 0.5;
        }
        
        this.input = new GainNode(context);
        this.delay = new DelayNode(context, {delayTime:this.delayTime});
        this.feedback = new GainNode(context, {gain: this.feedback});
        this.output = new GainNode(context);
        
        this.input.connect(this.delay);
        this.delay.connect(this.feedback);
        this.feedback.connect(this.delay);
        this.delay.connect(this.output);
    }
    
    connect(destination){
        this.output.connect(destination);
    }
    
    disconnect(destination, outputIndex = 0, inputIndex = 0){
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