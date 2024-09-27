class UnipolarPulseProcessor extends AudioWorkletProcessor {
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
      ];
    }
  
    constructor() {
      super();
      this.phase = 0;
    }
  
    process(inputs, outputs, parameters) {
      const output = outputs[0];
      const outputChannel = output[0];
  
      const frequencyParam = parameters.frequency;
      const pulseWidthParam = parameters.pulseWidth;
  
      for (let i = 0; i < outputChannel.length; i++) {
        const frequency =
          frequencyParam.length > 1 ? frequencyParam[i] : frequencyParam[0];
        const pulseWidth =
          pulseWidthParam.length > 1 ? pulseWidthParam[i] : pulseWidthParam[0];
  
        // Increment phase
        this.phase += frequency / sampleRate;
        this.phase -= Math.floor(this.phase); // Keep phase in [0, 1)
  
        // Output unipolar pulse wave based on phase and pulse width
        outputChannel[i] = this.phase < pulseWidth ? 1 : 0;
      }
  
      return true;
    }
  }
  
  registerProcessor('unipolar-pulse-processor', UnipolarPulseProcessor);