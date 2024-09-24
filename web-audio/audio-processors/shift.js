class ShiftRegisterProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this.numStages = options.processorOptions.numStages || 8;
      this.registers = new Array(this.numStages).fill(0);
      this.prevTrigger = 0;
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const triggerInput = inputs[1];
      const output = outputs;
  
      if (input.length === 0 || triggerInput.length === 0) {
        for (let i = 0; i < output.length; i++) {
          if (output[i][0]) {
            output[i][0].fill(this.registers[i] || 0);
          }
        }
        return true;
      }
  
      const inputChannel = input[0];
      const triggerChannel = triggerInput[0];
      const sampleFrames = inputChannel.length;
  
      for (let i = 0; i < sampleFrames; i++) {
        const currentTrigger = triggerChannel[i];
  
        // Detect rising edge in trigger signal
        if (this.prevTrigger <= 0 && currentTrigger > 0) {
          // Shift the register values
          for (let j = this.numStages - 1; j > 0; j--) {
            this.registers[j] = this.registers[j - 1];
          }
          // Capture the current input sample into the first register
          this.registers[0] = inputChannel[i];
  
          // Send the updated register values to the main thread
          this.port.postMessage({ registers: this.registers.slice() });
        }
  
        // Output the register values to the outputs
        for (let j = 0; j < this.numStages; j++) {
          if (output[j] && output[j][0]) {
            output[j][0][i] = this.registers[j];
          }
        }
  
        this.prevTrigger = currentTrigger;
      }
  
      return true;
    }
  }
  
  registerProcessor('shift-register-processor', ShiftRegisterProcessor);