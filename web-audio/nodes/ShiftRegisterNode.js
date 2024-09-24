export class ShiftRegisterNode {
    constructor(context, options = {}) {
      this.context = context;
      this.options = options;
    }
  
    async init() {
      await this.context.audioWorklet.addModule('./audio-processors/shift.js');
  
      const { numStages = 8, onRegistersUpdated = null } = this.options;
      this.numStages = numStages;
      this.onRegistersUpdated = onRegistersUpdated;
  
      this.node = new AudioWorkletNode(this.context, 'shift-register-processor', {
        numberOfInputs: 2,
        numberOfOutputs: this.numStages,
        channelCount: 1,
        outputChannelCount: new Array(this.numStages).fill(1),
        processorOptions: {
          numStages: this.numStages,
        },
      });
  
      this.input = new GainNode(this.context);
      this.trigger = new GainNode(this.context);
  
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
    }
  
    getRegisters() {
      return this.registers.slice();
    }
  
    connectOutput(stageIndex, destination) {
      if (stageIndex >= 0 && stageIndex < this.numStages) {
        if (destination instanceof AudioParam) {
          this.node.connect(destination, stageIndex);
        } else if (destination instanceof AudioNode) {
          if (destination.numberOfInputs > 0) {
            this.node.connect(destination, stageIndex, 0);
          } else {
            console.error('Destination AudioNode has no inputs.');
          }
        } else {
          console.error('Destination must be an AudioNode or AudioParam.');
        }
      } else {
        console.error('Invalid stage index:', stageIndex);
      }
    }
  
    disconnectOutput(stageIndex) {
      if (stageIndex >= 0 && stageIndex < this.numStages) {
        this.node.disconnect(stageIndex);
      } else {
        console.error('Invalid stage index:', stageIndex);
      }
    }
  }