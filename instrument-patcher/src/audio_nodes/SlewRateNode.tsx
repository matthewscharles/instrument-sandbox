import { CustomAudioNode } from './CustomAudioNode';

class SlewRateNode extends CustomAudioNode {
  input: GainNode;
  rise: GainNode;
  fall: GainNode;
  
  constructor(context: AudioContext) {
    super(context);

    this.input = context.createGain();
    this.rise = context.createGain();
    this.fall = context.createGain();
    this.initialized = false;

    this.initPromise = this.initialize(); // Start async init
  }

  private async initialize() {
    await this.context.audioWorklet.addModule('./audio-processors/slew-rate-processor.js');

    this.node = new AudioWorkletNode(this.context, 'slew-rate-processor', {
      numberOfInputs: 3,
      numberOfOutputs: 1,
      channelCount: 1, // Mono processing
    });

    // Connect the proxies to the processor inputs
    this.input.connect(this.node, 0, 0);  // Connect to input 0 (signal)
    this.rise.connect(this.node, 0, 1);   // Connect to input 1 (rise)
    this.fall.connect(this.node, 0, 2);   // Connect to input 2 (fall)

    this.output = this.node;

    this.initialized = true;
  }
}

export { SlewRateNode };