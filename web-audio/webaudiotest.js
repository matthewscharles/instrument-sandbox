const context = new AudioContext();
const osc = context.createOscillator();
const amp = context.createGain();

const middleC = 261.625565;

osc.type = 'sawtooth';
// middle C
osc.frequency.value = middleC;
// modulate in cents: one octave down
osc.detune.value = -1200;

osc.start();
let filter = context.createBiquadFilter();
osc.connect(filter);
filter.connect(amp);
amp.connect(context.destination);

// inputs will modulate the existing value
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


// freqLfoGain.connect(osc.frequency);

// const freqBase = context.createConstantSource();
// freqBase.offset.value = 400;
// freqBase.connect(osc.frequency);
// freqLfoGain.connect(freqBase.offset);