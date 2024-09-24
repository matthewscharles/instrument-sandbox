export class SampleHoldNode {
    constructor(context) {
      this.context = context;
      this.initialized = false;
      this.initPromise = this._init(); // Start async init
      
      // Create GainNodes to act as input proxies (initialised synchronously)
      this.input = new GainNode(context);
      this.trigger = new GainNode(context);
    }

    async _init() {
      await this.context.audioWorklet.addModule('./audio-processors/sample-hold-processor.js');
      // Create the AudioWorkletNode with three inputs
      this.node = new AudioWorkletNode(this.context, 'sample-hold-processor', {
        numberOfInputs: 2,
        numberOfOutputs: 1,
        channelCount: 1, // Mono processing
      });
      
      // Connect the proxies to the processor inputs
      this.input.connect(this.node, 0, 0); // Connect to input 0 (signal)
      this.trigger.connect(this.node, 0, 1);   // Connect to input 1 (trigger)

      // Expose the output of the processor
      this.output = this.node;
      
      this.initialized = true; // Mark as initialized
      
    }
    
    async connect(destination) {
      if (!this.initialized) {
        await this.initPromise; // Wait for initialization
      }
      
      this.output.connect(destination);
    }

    async disconnect(destination, outputIndex = 0, inputIndex = 0) {
        if (!this.initialized) {
          await this.initPromise; // Wait for initialization
        }
      
        if (!destination) {
          // Disconnect all outputs from this node
          this.node.disconnect();
        } else {
          if (destination instanceof AudioParam) {
            // Disconnect from the AudioParam
            this.node.disconnect(destination, outputIndex);
          } else if (destination instanceof AudioNode) {
            this.node.disconnect(destination, outputIndex, inputIndex);
          } else {
            console.error('Destination must be an AudioNode or AudioParam.');
          }
        }
      }
}