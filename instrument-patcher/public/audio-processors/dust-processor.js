class DustProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.lastValues = [];
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channelCount = output.length;

    for (let channel = 0; channel < channelCount; channel++) {
      const outputChannel = output[channel];

      if (this.lastValues[channel] === undefined) {
        this.lastValues[channel] = 0;
      }

      for (let i = 0; i < outputChannel.length; i++) {
        const randomValue = Math.random();
        if (randomValue > 0.9999 && this.lastValues[channel] !== 1) {
          outputChannel[i] = 1;
        } else {
          outputChannel[i] = 0;
        }
        this.lastValues[channel] = outputChannel[i];
      }
    }

    return true; // Keep the processor alive
  }
}

registerProcessor('dust-processor', DustProcessor);