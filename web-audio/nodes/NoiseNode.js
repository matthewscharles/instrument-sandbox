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
      
      this.initialized = true; // Mark as initialized
      
    }
    
    async connect(destination) {
      if (!this.initialized) {
        await this.initPromise; // Wait for initialization
      }
      
      this.output.connect(destination);
    }

    async disconnect() {
      if (!this.initialized) {
        await this.initPromise; // Wait for initialization
      }
      
      this.output.disconnect();
    }
}