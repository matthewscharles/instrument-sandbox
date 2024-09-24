class SampleAndHoldNode {
    constructor(context) {
      this.context = context;
      this.node = new AudioWorkletNode(context, 'sample-hold', {
        numberOfInputs: 2,
        numberOfOutputs: 1,
        channelCount: 1, // Mono processing
      });

      // Input proxies
      this.source = new GainNode(context);
      this.trigger = new GainNode(context);

      // Connect the proxies to the processor inputs
      this.source.connect(this.node, 0, 0);  // Connect to input 0
      this.trigger.connect(this.node, 0, 1); // Connect to input 1

      // Expose the output of the processor
      this.output = this.node;
    }

    connect(destination) {
      this.output.connect(destination);
    }

    disconnect() {
      this.output.disconnect();
    }
}