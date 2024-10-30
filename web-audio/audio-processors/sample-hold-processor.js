class SampleHoldProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.lastSample = 0;
    this.prevTrigger = 0;
  }

  process(inputs, outputs, parameters) {
    const sourceInputs = inputs[0];
    const triggerInputs = inputs[1];
    const outputsChannel = outputs[0];

    // Ensure both inputs are connected
    if (sourceInputs.length === 0 || triggerInputs.length === 0) {
      // If there's no input, output 0
      outputsChannel[0].fill(this.lastSample || 0);
      return true;
    }

    const input = sourceInputs[0];   // source signal (mono)
    const trigger = triggerInputs[0]; // trigger signal (mono)
    const output = outputsChannel[0];

    for (let i = 0; i < output.length; i++) {
      const currentTrigger = trigger[i];

      // Detect rising edge in trigger signal
      if (this.prevTrigger <= 0 && currentTrigger > 0) {
        this.lastSample = input[i];
      }
      
      output[i] = this.lastSample;
      this.prevTrigger = currentTrigger;
    }
    
    return true;
  }
}

registerProcessor('sample-hold-processor', SampleHoldProcessor);