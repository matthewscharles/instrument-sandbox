import { CustomAudioNode } from './CustomAudioNode'; // Adjust the import path as necessary

class SlewRateNode extends CustomAudioNode {
  private input: GainNode;
  private rise: GainNode;
  private fall: GainNode;
  output: AudioNode;

  constructor(context: AudioContext) {
    super(context);

    this.node = new AudioWorkletNode(context, 'slew-rate-processor', {
      numberOfInputs: 3,
      numberOfOutputs: 1,
      channelCount: 1,
    });

    this.input = context.createGain();
    this.rise = context.createGain();
    this.fall = context.createGain();
    this.output = this.node;
    this.initialized = false;

    this.initPromise = this.initialize();
  }

  private async initialize() {
    // Connect the proxies to the processor inputs
    this.input.connect(this.node, 0, 0); // Connect to input 0 (signal)
    this.rise.connect(this.node, 0, 1);   // Connect to input 1 (rise)
    this.fall.connect(this.node, 0, 2);   // Connect to input 2 (fall)

    this.initialized = true; // Mark as initialized
  }

}

export { SlewRateNode };