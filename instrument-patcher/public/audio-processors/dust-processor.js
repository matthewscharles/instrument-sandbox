class DustProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.lastValue = 0;
  }

  process(inputs, outputs, parameters) {
    const controlInput = inputs[0]; // Control input
    const output = outputs[0][0]; // Single output channel

    const controlChannel = controlInput.length > 0 ? controlInput[0] : null;

    for (let i = 0; i < output.length; i++) {
      let threshold = 0.9999; // Default threshold set very high
      if (controlChannel) {
        const controlValue = controlChannel[i]; // Expected range: 0 - 1
        // Map 0-1 to 0.999999 - 0.9991
        threshold = 0.9999 - controlValue * (0.9999 - 0.9991);
      }

      const randomValue = Math.random(); // Generate a random value between 0 and 1
      if (randomValue > threshold && this.lastValue !== 1) {
        output[i] = 1;
      } else {
        output[i] = 0;
      }
      this.lastValue = output[i];
    }

    return true; // Keep the processor alive
  }
}

registerProcessor('dust-processor', DustProcessor);