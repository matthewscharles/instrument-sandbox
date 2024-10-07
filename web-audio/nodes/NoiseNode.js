export class NoiseNode {
    constructor(context) {
      this.context = context;
      this.initialized = false;
      this.initPromise = this._init(); // Start async init
    }

    async _init() {
      await this.context.audioWorklet.addModule('./audio-processors/noise-processor.js');
      
      this.node = new AudioWorkletNode(this.context, 'noise-processor');
      
      // Expose the output of the processor
      this.output = this.node;
      
      this.initialized = true;
      
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