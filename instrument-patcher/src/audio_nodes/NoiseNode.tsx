// alternative approach (otherwise we have to place the audio-processors folder in the public folder)
// import noiseProcessor from './audio-processors/noise-processor.js?raw';


import { connect, disconnect } from './audioNodeMethods';

export class NoiseNode {
  context: AudioContext;
  initialized: boolean;
  initPromise: Promise<void>;
  node!: AudioWorkletNode;
  output!: AudioNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.initialized = false;
    this.initPromise = this._init(); // Start async init
  }

  async _init() {
    try {
      await this.context.audioWorklet.addModule('./audio-processors/noise-processor.js');
      
      this.node = new AudioWorkletNode(this.context, 'noise-processor');
      
      this.output = this.node;
      
      this.initialized = true; // Mark as initialised
    } catch (error) {
      console.error('Error during initialization:', error);
      throw error; // Re-throw the error to ensure the promise is rejected
    }
  }
  
  async connect(destination: AudioNode | AudioParam | AudioDestinationNode) {
    await connect(this, this.output, destination);
  }

  async disconnect(destination?: AudioNode | AudioParam | AudioDestinationNode, outputIndex: number = 0, inputIndex: number = 0) {
      await disconnect(this, this.output, destination, outputIndex, inputIndex);
  }
}