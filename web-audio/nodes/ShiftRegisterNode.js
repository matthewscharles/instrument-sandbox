
export class ShiftRegisterNode {
    constructor(context, options = {}) {
      this.context = context;
      this.options = options;
      this.initialized = false;
      this.initPromise = this._init(); // Start async init
  
      // input proxies created synchronously. 
      // this way the input can be connected before the processor is ready
      // (the signal is buffered in the gain nodes)
      this.input = new GainNode(this.context);
      this.trigger = new GainNode(this.context);
    }
  
    async _init() {
      await this.context.audioWorklet.addModule('./audio-processors/shift-register-processor.js');
  
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
  
    getRegisters() {
      return this.registers.slice();
    }
  
    async connectOutput(stageIndex, destination) {
        if (!this.initialized) {
          await this.initPromise; // Wait for initialization
        }
    
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
  
    async disconnectOutput(stageIndex, destination, outputIndex = 0, inputIndex = 0) {
        if (!this.initialized) {
            await this.initPromise; // Wait for initialization
          }
        if (stageIndex >= 0 && stageIndex < this.numStages) {
          if (!destination) {
            // Disconnect all connections from the specified output
            this.node.disconnect(stageIndex);
          } else {
            // Destination is specified
            if (destination instanceof AudioNode || destination instanceof AudioParam) {
              // Disconnect the connection from the specified output to the destination
              this.node.disconnect(destination, stageIndex, inputIndex);
            } else {
              console.error('Destination must be an AudioNode or AudioParam.');
            }
          }
        } else {
          console.error('Invalid stage index:', stageIndex);
        }
      }
}