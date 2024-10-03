import { CustomAudioNode } from './CustomAudioNode';

export class DustNode extends CustomAudioNode {
  private _input: ConstantSourceNode;

  constructor(context: AudioContext) {
    super(context);
    this._input = context.createConstantSource();
    this._input.offset.value = 0;
    this._input.start();
  }

  protected async _init() {
    try {
      await this.context.audioWorklet.addModule('./audio-processors/dust-processor.js');
      this.node = new AudioWorkletNode(this.context, 'dust-processor', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
      });
      this._input.connect(this.node, 0); // Connect the constant source to the control input
      this.output = this.node;
      this.initialized = true;
    } catch (error) {
      console.error('Error during initialization:', error);
      throw error; // Re-throw the error to ensure the promise is rejected
    }
  }

  get input() {
    return this._input.offset;
  }
}