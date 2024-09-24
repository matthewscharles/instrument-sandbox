// alternative approach (otherwise we have to place the audio-processors folder in the public folder)
// import noiseProcessor from './audio-processors/noise-processor.js?raw';

import { ToneAudioNode } from 'tone';

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
      
      // Expose the output of the processor
      this.output = this.node;
      console.log('NoiseNode initialized');
      this.initialized = true; // Mark as initialized
    } catch (error) {
      console.error('Error during initialization:', error);
      throw error; // Re-throw the error to ensure the promise is rejected
    }
  }
  
  async connect(destination: AudioNode | AudioParam) {
    if (!this.initialized) {
      console.log('NoiseNode not initialized');
      await this.initPromise; // Wait for initialization
    }
    console.log('destination', destination);
    if (destination instanceof AudioNode) {
      this.output.connect(destination);
    } else if (destination instanceof AudioParam) {
      this.output.connect(destination);
    } else if (destination instanceof ToneAudioNode) {
      console.log('destination is ToneAudioNode');
      // this.output.connect(destination.input);
      
      //** there seems to be an issue connecting between my custom objects and Tone that I don't understand yet */
      
      (window as any).context.filter = (window as any).context.createBiquadFilter();
      this.output.connect((window as any).context.filter);
      
    } else {
      console.error('Destination must be an AudioNode, AudioParam, or ToneAudioNode.');
    }
  }

  async disconnect(destination?: AudioNode | AudioParam, outputIndex = 0, inputIndex = 0) {
    if (!this.initialized) {
      await this.initPromise; // Wait for initialization
    }
    
    if (!destination) {
      // Disconnect all outputs from this node
      this.node.disconnect();
    } else {
      if (destination instanceof AudioParam) {
        // Disconnect from the AudioParam
        this.node.disconnect(destination, outputIndex);
      } else if (destination instanceof AudioNode) {
        this.node.disconnect(destination, outputIndex, inputIndex);
      } else if (destination instanceof ToneAudioNode) {
        this.node.disconnect(destination.input, outputIndex, inputIndex);
      } else {
        console.error('Destination must be an AudioNode, AudioParam, or ToneAudioNode.');
      }
    }
  }
}