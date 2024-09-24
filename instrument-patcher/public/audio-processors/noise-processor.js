class NoiseProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channelCount = output.length;

    for (let channel = 0; channel < channelCount; channel++) {
      const outputChannel = output[channel];

      for (let i = 0; i < outputChannel.length; i++) {
        // outputChannel[i] = Math.random() * 2 - 1; // Generate white noise
        outputChannel[i] = Math.random(); // range 0-1
      }
    }

    return true; // Keep the processor alive
  }
}

registerProcessor('noise-processor', NoiseProcessor);