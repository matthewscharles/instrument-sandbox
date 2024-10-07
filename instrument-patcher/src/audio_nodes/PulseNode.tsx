import { CustomAudioNode } from './CustomAudioNode';

export class PulseNode extends CustomAudioNode {
  private _frequencySource: ConstantSourceNode;
  private _pulseWidthSource: ConstantSourceNode;
  private _phaseSource: ConstantSourceNode;

  constructor(context: AudioContext, initialFrequency: number = 0, initialPulseWidth: number = 0.5) {
    super(context);
    this._frequencySource = context.createConstantSource();
    this._pulseWidthSource = context.createConstantSource();
    this._phaseSource = context.createConstantSource();

    this._frequencySource.offset.value = initialFrequency;
    this._pulseWidthSource.offset.value = initialPulseWidth;
    this._phaseSource.offset.value = 0; // Default phase to 0

    this._frequencySource.start();
    this._pulseWidthSource.start();
    this._phaseSource.start();
  }

  protected async _init() {
    try {
      await this.context.audioWorklet.addModule('./audio-processors/pulse-processor.js');
      this.node = new AudioWorkletNode(this.context, 'pulse-processor', {
        numberOfInputs: 3,
        numberOfOutputs: 1,
        outputChannelCount: [1],
      });
      this._frequencySource.connect(this.node, 0, 0); // Connect frequency source
      this._pulseWidthSource.connect(this.node, 0, 1); // Connect pulse width source
      this._phaseSource.connect(this.node, 0, 2); // Connect phase source
      this.output = this.node;
      this.initialized = true;
    } catch (error) {
      console.error('Error during initialization:', error);
      throw error; // Re-throw the error to ensure the promise is rejected
    }
  }

  get frequency() {
    return this._frequencySource.offset;
  }

  get pulseWidth() {
    return this._pulseWidthSource.offset;
  }

  get phase() {
    return this._phaseSource.offset;
  }
}