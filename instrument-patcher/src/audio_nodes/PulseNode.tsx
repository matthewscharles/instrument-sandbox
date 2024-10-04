import { CustomAudioNode } from './CustomAudioNode';

export class PulseNode extends CustomAudioNode {
  private _frequencyInput: GainNode;
  private _pulseWidthInput: GainNode;
  private _phaseInput: GainNode;

  constructor(context: AudioContext) {
    super(context);
    this._frequencyInput = context.createGain(); 
    this._pulseWidthInput = context.createGain(); 
    this._phaseInput = context.createGain();
  }

  protected async _init() {
    try {
      await this.context.audioWorklet.addModule('./audio-processors/pulse-processor.js');
      this.node = new AudioWorkletNode(this.context, 'pulse-processor', {
        numberOfInputs: 3,
        numberOfOutputs: 1,
        outputChannelCount: [1],
      });
      this._frequencyInput.connect(this.node, 0, 0); // Connect frequency input
      this._pulseWidthInput.connect(this.node, 0, 1); // Connect pulse width input
      this._phaseInput.connect(this.node, 0, 2); // Connect phase input
      this.output = this.node;
      this.initialized = true;
    } catch (error) {
      console.error('Error during initialization:', error);
      throw error; // Re-throw the error to ensure the promise is rejected
    }
  }

  get frequency() {
    return this._frequencyInput;
  }

  get pulseWidth() {
    return this._pulseWidthInput;
  }

  get phase() {
    return this._phaseInput;
  }
}