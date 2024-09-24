 class SlewRateNode {
    constructor(context) {
      this.context = context;

      // Create the AudioWorkletNode with three inputs
      this.node = new AudioWorkletNode(context, 'slew', {
        numberOfInputs: 3,
        numberOfOutputs: 1,
        channelCount: 1, // Mono processing
      });

      // Create GainNodes to act as input proxies
      this.signal = new GainNode(context);
      this.rise = new GainNode(context);
      this.fall = new GainNode(context);

      // Connect the proxies to the processor inputs
      this.signal.connect(this.node, 0, 0); // Connect to input 0 (signal)
      this.rise.connect(this.node, 0, 1);   // Connect to input 1 (rise)
      this.fall.connect(this.node, 0, 2);   // Connect to input 2 (fall)

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