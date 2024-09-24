class ShiftRegisterProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      // Get the number of stages from the options, default to 8
      this.numStages = options.processorOptions.numStages || 8;
      // Initialize the shift register with zeros
      this.registers = new Array(this.numStages).fill(0);
      this.prevTrigger = 0;
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const triggerInput = inputs[1];
      const output = outputs;
  
      // Ensure inputs are connected
      if (input.length === 0 || triggerInput.length === 0) {
        // Output zeros if inputs are not connected
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
        }
        // console.log('this.registers: ', this.registers);
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
  
  registerProcessor('shift-register', ShiftRegisterProcessor);