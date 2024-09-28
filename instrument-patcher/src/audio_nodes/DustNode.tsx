import { CustomAudioNode } from './CustomAudioNode';

export class DustNode extends CustomAudioNode {
  constructor(context: AudioContext) {
    super(context);
  }

  protected async _init() {
    try {
      await this.context.audioWorklet.addModule('./audio-processors/dust-processor.js');
      this.node = new AudioWorkletNode(this.context, 'dust-processor');
      this.output = this.node;
      // console.log('DustNode initialized');
      this.initialized = true; // Mark as initialized
    } catch (error) {
      console.error('Error during initialization:', error);
      throw error; // Re-throw the error to ensure the promise is rejected
    }
  }
}