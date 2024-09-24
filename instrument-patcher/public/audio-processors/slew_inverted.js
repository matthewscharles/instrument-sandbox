// slew-rate-processor.js

class SlewRateProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.previousOutputSample = 0;
    this.count = 0;
  }

  process(inputs, outputs, parameters) {
    
    const signalInputs = inputs[0];
    const riseInputs = inputs[1];
    const fallInputs = inputs[2];
    const outputsChannel = outputs[0];

    // Ensure the signal input is connected
    if (signalInputs.length === 0 || signalInputs[0].length === 0) {
      outputsChannel[0].fill(this.previousOutputSample || 0);
      return true;
    }

    const signalChannel = signalInputs[0]; 
    const outputChannel = outputsChannel[0];

    // Default rise and fall rates if not connected (no limit)
    let riseChannel = null;
    let fallChannel = null;
    
    if (riseInputs.length > 0 && riseInputs[0].length > 0) {
      riseChannel = riseInputs[0];
    }
    
    if (fallInputs.length > 0 && fallInputs[0].length > 0) {
      fallChannel = fallInputs[0];
    }

    const sampleRate = globalThis.sampleRate; // Audio sample rate
    
    for (let i = 0; i < outputChannel.length; i++) {
      const signalSample = signalChannel[i];
      if(this.count % 44100 === 0)console.log('signalSample: ', signalSample);

      // Get rise and fall rates per sample
      let riseRatePerSample = Infinity; // Default to no limit
      let fallRatePerSample = Infinity;

      if (riseChannel) {
        const riseRate = riseChannel[i]; // Rise rate in units per second
        riseRatePerSample = riseRate > 0 ? riseRate / sampleRate : 0;
      }

      if (fallChannel) {
        const fallRate = fallChannel[i]; // Fall rate in units per second
        fallRatePerSample = fallRate > 0 ? fallRate / sampleRate : 0;
      }

      const delta = signalSample - this.previousOutputSample;
      let limitedDelta = delta;

      if (delta > 0) {
        // Rising edge
        limitedDelta = Math.min(delta, riseRatePerSample);
      } else if (delta < 0) {
        // Falling edge
        limitedDelta = Math.max(delta, -fallRatePerSample);
      } else {
        limitedDelta = 0;
      }
      
      const outputSample = this.previousOutputSample + limitedDelta;
      outputChannel[i] = outputSample;
      this.previousOutputSample = outputSample;
    }

    return true;
  }
}

registerProcessor('slew', SlewRateProcessor);