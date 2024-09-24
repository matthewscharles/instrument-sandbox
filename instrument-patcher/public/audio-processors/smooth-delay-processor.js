class SmoothDelayProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'delayTime',
        defaultValue: 0.5, // Default delay time in seconds
        minValue: 0,
        maxValue: 5,
        automationRate: 'a-rate', 
      },
      {
        name: 'feedback',
        defaultValue: 0.0,
        minValue: 0.0,
        maxValue: 1, // 0.9999
        automationRate: 'a-rate',
      },
    ];
  }

  constructor() {
    super();
    this.sampleRate = sampleRate;
    this.maxDelayTime = 5; // Maximum delay time in seconds

    // Calculate buffer length based on maximum delay time
    this.bufferLength = Math.ceil(this.maxDelayTime * this.sampleRate);
    this.delayBuffer = new Float32Array(this.bufferLength);

    // Read and write positions in the buffer
    this.writeIndex = 0;

    // Initialize variables for interpolation
    this.previousDelayTime = 0.5;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    const inputChannel = input[0];
    const outputChannel = output[0];

    const delayTimeParam = parameters.delayTime;
    const feedbackParam = parameters.feedback;

    if (!inputChannel || !outputChannel) {
      return true;
    }

    const numSamples = inputChannel.length;

    for (let i = 0; i < numSamples; i++) {
      // Get delay time and feedback for the current sample
      const delayTime = delayTimeParam.length > 1 ? delayTimeParam[i] : delayTimeParam[0];
      const feedback = feedbackParam.length > 1 ? feedbackParam[i] : feedbackParam[0];

      // Clamp delay time and feedback to valid ranges
      const clampedDelayTime = Math.max(0, Math.min(this.maxDelayTime, delayTime));
      const clampedFeedback = Math.max(0, Math.min(1, feedback));

      // Calculate the read index with fractional delay
      const delayInSamples = clampedDelayTime * this.sampleRate;
      const readIndex = (this.writeIndex - delayInSamples + this.bufferLength) % this.bufferLength;

      // Interpolate the delayed sample
      const readSample = this.interpolateDelayBuffer(readIndex);

      // Calculate the output sample
      const inputSample = inputChannel[i];
      const outputSample = inputSample + readSample * clampedFeedback;

      // Store the output sample in the buffer for future use
      this.delayBuffer[this.writeIndex] = outputSample;

      // Write the output sample
      outputChannel[i] = outputSample;

      // Update write index
      this.writeIndex = (this.writeIndex + 1) % this.bufferLength;
    }

    return true;
  }

  interpolateDelayBuffer(readIndex) {
    // Get the integer and fractional parts of the read index
    const intPart = Math.floor(readIndex);
    const fracPart = readIndex - intPart;

    // Get the two samples for interpolation
    const sample1 = this.delayBuffer[intPart % this.bufferLength];
    const sample2 = this.delayBuffer[(intPart + 1) % this.bufferLength];

    // Linear interpolation
    return sample1 + fracPart * (sample2 - sample1);
  }
}

registerProcessor('smooth-delay-processor', SmoothDelayProcessor);