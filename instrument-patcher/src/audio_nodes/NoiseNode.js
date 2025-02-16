// alternative approach (otherwise we have to place the audio-processors folder in the public folder)
// import noiseProcessor from './audio-processors/noise-processor.js?raw';
import { CustomAudioNode } from './CustomAudioNode';
export class NoiseNode extends CustomAudioNode {
    constructor(context) {
        super(context);
    }
    async _init() {
        try {
            await this.context.audioWorklet.addModule('./audio-processors/noise-processor.js');
            this.node = new AudioWorkletNode(this.context, 'noise-processor');
            this.output = this.node;
            this.initialized = true;
        }
        catch (error) {
            console.error('Error during initialization:', error);
            throw error; // Re-throw the error to ensure the promise is rejected
        }
    }
}
