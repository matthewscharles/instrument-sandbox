class PulseProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'frequency',
        defaultValue: 1,
        minValue: 0,
        maxValue: sampleRate / 2,
        automationRate: 'a-rate',
      },
      {
        name: 'pulseWidth',
        defaultValue: 0.5,
        minValue: 0.01,
        maxValue: 0.99,
        automationRate: 'a-rate',
      },
      {
        name: 'bipolar',
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: 'k-rate',
      },
    ];
  }

  constructor() {
    super();
    this.phase = 0;
  }

  process(inputs, outputs, parameters) {
    const frequencyInput = inputs[0][0] || [];
    const pulseWidthInput = inputs[1][0] || [];
    const phaseInput = inputs[2][0] || [];
    const output = outputs[0][0];

    const frequencyParam = parameters.frequency;
    const pulseWidthParam = parameters.pulseWidth;
    const bipolarParam = parameters.bipolar;

    for (let i = 0; i < output.length; i++) {
      const frequency = frequencyInput[i] !== undefined ? frequencyInput[i] : (frequencyParam.length > 1 ? frequencyParam[i] : frequencyParam[0]);
      const pulseWidth = pulseWidthInput[i] !== undefined ? pulseWidthInput[i] : (pulseWidthParam.length > 1 ? pulseWidthParam[i] : pulseWidthParam[0]);
      const phaseOffset = phaseInput[i] !== undefined ? phaseInput[i] : 0;
      const bipolar = bipolarParam.length > 1 ? bipolarParam[i] : bipolarParam[0];

      // Increment phase
      this.phase += frequency / sampleRate;
      this.phase -= Math.floor(this.phase); // Keep phase in [0, 1)
      this.phase += phaseOffset; // Apply phase offset

      // Output pulse wave based on phase, pulse width, and bipolar setting
      if (bipolar) {
        output[i] = this.phase < pulseWidth ? 1 : -1;
      } else {
        output[i] = this.phase < pulseWidth ? 1 : 0;
      }
    }

    return true;
  }
}

registerProcessor('pulse-processor', PulseProcessor);