 class SlewRateNode {
    constructor(context) {
      this.context = context;
      this.initialized = false;
      this.initPromise = this._init(); // Start async init
      
      // Create GainNodes to act as input proxies (initialised synchronously)
      this.input = new GainNode(context);
      this.rise = new GainNode(context);
      this.fall = new GainNode(context);

      // Connect the proxies to the processor inputs
      this.input.connect(this.node, 0, 0); // Connect to input 0 (signal)
      this.rise.connect(this.node, 0, 1);   // Connect to input 1 (rise)
      this.fall.connect(this.node, 0, 2);   // Connect to input 2 (fall)

      // Expose the output of the processor
      this.output = this.node;
    }

    async _init() {
      await this.context.audioWorklet.addModule('./audio-processors/slew-rate-processor.js');
      // Create the AudioWorkletNode with three inputs
      this.node = new AudioWorkletNode(context, 'slew', {
        numberOfInputs: 3,
        numberOfOutputs: 1,
        channelCount: 1, // Mono processing
      });
      
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