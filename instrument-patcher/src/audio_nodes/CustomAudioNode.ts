import { connect, disconnect } from './audioNodeMethods';

export abstract class CustomAudioNode {
  context: AudioContext;
  initialized: boolean;
  initPromise: Promise<void>;
  node!: AudioWorkletNode;
  output!: AudioNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.initialized = false;
    this.initPromise = this._init(); 
  }

  protected async _init(): Promise<void> {
    this.initialized = true;
  }

  async connect(destination: AudioNode | AudioParam | AudioDestinationNode) {
    await connect(this, this.output, destination);
  }

  async disconnect(destination?: AudioNode | AudioParam | AudioDestinationNode, outputIndex: number = 0, inputIndex: number = 0) {
    await disconnect(this, this.output, destination, outputIndex, inputIndex);
  }
}