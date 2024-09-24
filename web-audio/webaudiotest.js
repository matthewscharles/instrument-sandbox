/**
 * Useful methods:
 * (use context.currentTime + x)
 * exponentialRampToValueAtTime
 * linearRampToValueAtTime
 * setTargetAtTime
 * setValueAtTime
 * setValueCurveAtTime
 */

import { ShiftRegisterNode } from './nodes/ShiftRegisterNode.js';
import { SlewRateNode } from './nodes/SlewRateNode.js';
import { NoiseNode } from './nodes/NoiseNode.js';
import { SampleHoldNode } from './nodes/SampleHoldNode.js';

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
    window.sh = new SampleHoldNode(context);

    window.noise = new NoiseNode(context);

    window.oscillator = new OscillatorNode(context, {
        type: 'square',
        frequency: 3, 
    });

    oscillator.start();

    noise.connect(sh.input);
    sh.connect(oscillator.frequency);
    
    oscillator.connect(sh.trigger);
    const noiseAmp = context.createGain();
    noiseAmp.gain.value = 1000;

    sh.connect(noiseAmp);
    
    const slew = new SlewRateNode(context);
    window.shift = new ShiftRegisterNode(context, { numStages: 8 });

    noiseAmp.connect(shift.input);
    oscillator.connect(shift.trigger);
        
    let shiftOut = new Array(8).fill(0).map((_, i) => {
        const osci = new OscillatorNode(context, { type: 'square', frequency: 200 * (i+1) });
        const gain = new GainNode(context, { gain: 0.02 });
        osci.connect(gain).connect(context.destination);
        osci.start();
        return osci;
    });
    
    for (let i = 0; i < 8; i++) {
        shift.connectOutput(i, shiftOut[i].frequency);
    }
    
    //   window.riseNode = new ConstantSourceNode(context, { offset: 0.001 }); 
    window.riseNode = context.createOscillator({ type: 'sawtooth', frequency: 1 });
    riseNode.start();

    window.fallNode = new ConstantSourceNode(context, { offset: 0.001 }); 
    //   window.fallNode = context.createOscillator({ type: 'sine', frequency: 0.2 });
    fallNode.start();

    noiseAmp.connect(slew.input);
    riseNode.connect(slew.rise);
    fallNode.connect(slew.fall);
        // noiseAmp.connect(osc.frequency)
    slew.connect(osc.frequency);
    if (context.state === 'suspended') {
        await context.resume();
    }
})();

// freqLfoGain.connect(osc.frequency);

// const freqBase = context.createConstantSource();
// freqBase.offset.value = 400;
// freqBase.connect(osc.frequency);
// freqLfoGain.connect(freqBase.offset);