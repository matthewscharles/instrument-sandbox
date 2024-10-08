import { CustomAudioNode } from './CustomAudioNode';

interface MidiControlChangeNodeOptions {
    value?: number;
    cc?: number;
}

export class MidiControlChangeNode extends CustomAudioNode {
    context: AudioContext;
    initialized: boolean;
    input: GainNode;
    output: ConstantSourceNode;
    cc: number;

    constructor(context: AudioContext, options: MidiControlChangeNodeOptions = {}) {
        super(context);
        this.context = context;
        this.initialized = true;
        this.cc = options.cc || 0; 

        this.input = new GainNode(context);
        this.output = new ConstantSourceNode(context, { offset: options.value || 0 });
        this.output.start();
        this.input.connect(this.output.offset);

        this.initMIDI();
    }

    get value() {
        return this.output.offset;
    }
    
    get ccValue() {
        return this.cc;
    }
    
    set ccValue(value: number) {
        this.cc = value;
    }

    private async initMIDI() {
        if (navigator.requestMIDIAccess) {
            try {
                const midiAccess = await navigator.requestMIDIAccess();
                this.onMIDISuccess(midiAccess);
            } catch (error) {
                console.error('Failed to get MIDI access', error);
            }
        } else {
            console.warn('Web MIDI API is not supported in this browser.');
        }
    }

    private onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
        const inputs = midiAccess.inputs.values();
        console.log('MIDI inputs:', inputs);
        for (let input of inputs) {
            input.onmidimessage = this.getMIDIMessage.bind(this);
        }
    }

    private getMIDIMessage(message: WebMidi.MIDIMessageEvent) {
        const [status, data1, data2] = message.data;
        const isControlChange = (status & 0xf0) === 0xb0;
        const isTargetCC = data1 === this.cc; // Use the cc value for filtering
        // console.log(this.cc, data1);
        // console.log(`status: ${status}, data1: ${data1}, data2: ${data2}`);
        if (isControlChange && isTargetCC) {
            const value = data2 / 127; // Normalize to 0-1 range
            // console.log(value);
            // const value = data2;
            console.log(`CC ${data1}: ${value}`);
            this.output.offset.setValueAtTime(value, this.context.currentTime);
        }
    }
}