/**
 * context.currentTime + x
 * exponentialRampToValueAtTime
 * linearRampToValueAtTime
 * setTargetAtTime
 * setValueAtTime
 * setValueCurveAtTime
 */

const context = new AudioContext();
const osc = context.createOscillator();
const amp = context.createGain();

const middleC = 261.625565;

osc.type = 'sawtooth';
osc.frequency.value = middleC;
// modulate in cents: one octave down
osc.detune.value = -1200;
osc.start();

let filter = context.createBiquadFilter();

osc.connect(filter);
filter.connect(amp);
amp.connect(context.destination);

// inputs modulate the existing value
amp.gain.value=0;

const lfo = context.createOscillator();
const lfoGain = context.createGain();
lfo.frequency.value = 0.1;
lfo.connect(lfoGain);
lfoGain.gain.value=0.5;
lfoGain.connect(amp.gain);
lfo.start();

const freqLfo = context.createOscillator();
freqLfo.frequency.value = 3;
const freqLfoGain = context.createGain();
freqLfo.start();
freqLfo.connect(freqLfoGain);

freqLfoGain.gain.value=300
freqLfoGain.connect(filter.frequency)

const delayUnit = {
    delay: context.createDelay(8),
    feedback: context.createGain(),
    wet: context.createGain()
}

delayUnit.delay.delayTime.value = 0.5;
delayUnit.feedback.gain.value = 0.1;

delayUnit.wet.gain.value = 0.5;
delayUnit.delay.connect(delayUnit.feedback);
delayUnit.feedback.connect(delayUnit.delay);
delayUnit.wet.connect(context.destination);
delayUnit.delay.connect(delayUnit.wet);

filter.connect(delayUnit.delay);
    
(async () => {
    await context.audioWorklet.addModule('noise.js');
    await context.audioWorklet.addModule('sh.js');
    await context.audioWorklet.addModule('slew.js');
    await context.audioWorklet.addModule('shift.js');
    
    class SlewRateNode {
        constructor(context) {
          this.context = context;
    
          // Create the AudioWorkletNode with three inputs
          this.node = new AudioWorkletNode(context, 'slew', {
            numberOfInputs: 3,
            numberOfOutputs: 1,
            channelCount: 1, // Mono processing
          });
    
          // Create GainNodes to act as input proxies
          this.signal = new GainNode(context);
          this.rise = new GainNode(context);
          this.fall = new GainNode(context);
    
          // Connect the proxies to the processor inputs
          this.signal.connect(this.node, 0, 0); // Connect to input 0 (signal)
          this.rise.connect(this.node, 0, 1);   // Connect to input 1 (rise)
          this.fall.connect(this.node, 0, 2);   // Connect to input 2 (fall)
    
          // Expose the output of the processor
          this.output = this.node;
        }
    
        connect(destination) {
          this.output.connect(destination);
        }
    
        disconnect() {
          this.output.disconnect();
        }
      }
    
    class SampleAndHoldNode {
        constructor(context) {
          this.context = context;
          this.node = new AudioWorkletNode(context, 'sample-hold', {
            numberOfInputs: 2,
            numberOfOutputs: 1,
            channelCount: 1, // Mono processing
          });
    
          // Input proxies
          this.source = new GainNode(context);
          this.trigger = new GainNode(context);
    
          // Connect the proxies to the processor inputs
          this.source.connect(this.node, 0, 0);  // Connect to input 0
          this.trigger.connect(this.node, 0, 1); // Connect to input 1
    
          // Expose the output of the processor
          this.output = this.node;
        }
    
        connect(destination) {
          this.output.connect(destination);
        }
    
        disconnect() {
          this.output.disconnect();
        }
    }
    
    class ShiftRegisterNode {
        constructor(context, options = {}) {
          this.context = context;
          this.numStages = options.numStages || 8;
    
          // Create the AudioWorkletNode with two inputs and multiple outputs
          this.node = new AudioWorkletNode(context, 'shift-register', {
            numberOfInputs: 2,
            numberOfOutputs: this.numStages,
            channelCount: 1, // Mono processing
            outputChannelCount: new Array(this.numStages).fill(1), // Mono outputs
            processorOptions: {
              numStages: this.numStages,
            },
          });
    
          // Create GainNodes to act as input proxies
          this.input = new GainNode(context);
          this.trigger = new GainNode(context);
    
          // Connect the proxies to the processor inputs
          this.input.connect(this.node, 0, 0);    // Connect to input 0 (signal input)
          this.trigger.connect(this.node, 0, 1);  // Connect to input 1 (trigger input)
        }
    
        // Method to connect an output to a destination
        connectOutput(stageIndex, destination) {
            if (stageIndex >= 0 && stageIndex < this.numStages) {
              this.node.connect(destination, stageIndex, 0);
            } else {
              console.error('Invalid stage index:', stageIndex);
            }
          }
        
          disconnectOutput(stageIndex) {
            if (stageIndex >= 0 && stageIndex < this.numStages) {
              this.node.disconnect(stageIndex);
            } else {
              console.error('Invalid stage index:', stageIndex);
            }
          }
        
    
    }
  
    window.sh = new SampleAndHoldNode(context);

    window.noise = new AudioWorkletNode(context, 'white-noise');

    window.oscillator = new OscillatorNode(context, {
        type: 'square',
        frequency: 10, 
    });

    oscillator.start();

    noise.connect(sh.source);
    // sh.connect(oscillator.frequency);
    // sh.connect(delayUnit.delay.delayTime);
    oscillator.connect(sh.trigger);
    const noiseAmp = context.createGain();
    noiseAmp.gain.value = 1000;

    sh.connect(noiseAmp);
    
  const slew = new SlewRateNode(context);
  window.shift = new ShiftRegisterNode(context, { numStages: 8 });
  noiseAmp.connect(shift.input);
  oscillator.connect(shift.trigger);
  
  let shiftOut = new Array(8).fill(0).map((_, i) => {
    const osci = context.createOscillator('sine');
    const gain = context.createGain();
    osci.connect(gain);
    gain.gain.value = 0.2;
    // console.log(osci, shift.node, gain);
    gain.connect(context.destination);
    // shift.connectOutput(i, osci.frequency);
    return osci;
  });
  
//   shift.connectOutput(0, shiftOut[0]);
  for(let i = 1; i < 8; i++) {
    console.log(shiftOut[i])

    shift.connectOutput(i, shiftOut[i]);
  }
  
  window.riseNode = new ConstantSourceNode(context, { offset: 0.001 }); 
  riseNode.start();

  window.fallNode = new ConstantSourceNode(context, { offset: 0.1 }); 
  fallNode.start();

  noiseAmp.connect(slew.signal);
  riseNode.connect(slew.rise);
  fallNode.connect(slew.fall);
    // noiseAmp.connect(osc.frequency)
    slew.connect(osc.frequency);
  })();

// freqLfoGain.connect(osc.frequency);

// const freqBase = context.createConstantSource();
// freqBase.offset.value = 400;
// freqBase.connect(osc.frequency);
// freqLfoGain.connect(freqBase.offset);