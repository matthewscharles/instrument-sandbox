import { CustomAudioNode } from './CustomAudioNode'; 

interface ShiftRegisterNodeOptions {
  numStages?: number;
  onRegistersUpdated?: (registers: number[]) => void;
}

class ShiftRegisterNode extends CustomAudioNode {
  private input: GainNode;
  private trigger: GainNode;
  private registers: number[];
  private numStages: number;
  private onRegistersUpdated: ((registers: number[]) => void) | null;

  constructor(context: AudioContext, options: ShiftRegisterNodeOptions = {}) {
    super(context);

    this.input = new GainNode(this.context);
    this.trigger = new GainNode(this.context);
    this.initialized = false;
    this.initPromise = this._init(); // Start async init

    const { numStages = 8, onRegistersUpdated = null } = options;
    this.numStages = numStages;
    this.onRegistersUpdated = onRegistersUpdated;
  }

  async _init() {
    await this.context.audioWorklet.addModule('./audio-processors/shift-register-processor.js');

    this.node = new AudioWorkletNode(this.context, 'shift-register-processor', {
      numberOfInputs: 2,
      numberOfOutputs: this.numStages,
      channelCount: 1,
      outputChannelCount: new Array(this.numStages).fill(1),
      processorOptions: {
        numStages: this.numStages,
      },
    });

    this.input.connect(this.node, 0, 0);
    this.trigger.connect(this.node, 0, 1);

    this.registers = new Array(this.numStages).fill(0);

    this.node.port.onmessage = (event) => {
      if (event.data.registers) {
        this.registers = event.data.registers;
        if (this.onRegistersUpdated) {
          this.onRegistersUpdated(this.registers.slice());
        }
      }
    };

    this.initialized = true; 
  }

  getRegisters(): number[] {
    return this.registers.slice();
  }

}

export { ShiftRegisterNode };