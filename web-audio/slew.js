/**
 * Slew rate limiter AudioWorkletProcessor
 * 
 */
class SlewRateProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.previousOutputSample = 0;
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

    // Default rise and fall times if not connected (0 seconds, no limiting)
    let riseTimeChannel = null;
    let fallTimeChannel = null;
    
    if (riseInputs.length > 0 && riseInputs[0].length > 0) {
      riseTimeChannel = riseInputs[0];
    }
    if (fallInputs.length > 0 && fallInputs[0].length > 0) {
      fallTimeChannel = fallInputs[0];
    }

    const sampleRate = globalThis.sampleRate;

    for (let i = 0; i < outputChannel.length; i++) {
      const signalSample = signalChannel[i];

      // Get rise and fall time constants per sample
      let riseAlpha = 0;
      let fallAlpha = 0;

      if (riseTimeChannel) {
        const riseTime = riseTimeChannel[i]; // Rise time in seconds
        if (riseTime > 0) {
          riseAlpha = Math.exp(-1 / (riseTime * sampleRate));
        } else {
          riseAlpha = 0; // No limiting
        }
      }

      if (fallTimeChannel) {
        const fallTime = fallTimeChannel[i]; // Fall time in seconds
        if (fallTime > 0) {
          fallAlpha = Math.exp(-1 / (fallTime * sampleRate));
        } else {
          fallAlpha = 0; // No limiting
        }
      }

      let outputSample = this.previousOutputSample;

      if (signalSample > this.previousOutputSample) {
        //* Rising edge
        outputSample = riseAlpha * this.previousOutputSample + (1 - riseAlpha) * signalSample;
      } else if (signalSample < this.previousOutputSample) {
        //* Falling edge
        outputSample = fallAlpha * this.previousOutputSample + (1 - fallAlpha) * signalSample;
      } else {
        outputSample = signalSample;
      }

      outputChannel[i] = outputSample;
      this.previousOutputSample = outputSample;
    }

    return true;
  }
}

registerProcessor('slew', SlewRateProcessor);