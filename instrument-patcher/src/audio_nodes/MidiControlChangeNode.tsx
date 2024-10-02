import { CustomAudioNode } from './CustomAudioNode';

interface MidiControlChangeNodeOptions {
    value?: number;
    cc?: number; // Add cc property to specify the MIDI CC lane
}

export class MidiControlChangeNode extends CustomAudioNode {
    context: AudioContext;
    initialized: boolean;
    input: GainNode;
    output: ConstantSourceNode;
    cc: number; // Store the cc value

    constructor(context: AudioContext, options: MidiControlChangeNodeOptions = {}) {
        super(context);
        this.context = context;
        this.initialized = true;
        this.cc = options.cc || 113; // Default to CC 113 if not specified

        this.input = new GainNode(context);
        this.output = new ConstantSourceNode(context, { offset: options.value || 0 });
        this.output.start();
        this.input.connect(this.output.offset);

        this.initMIDI();
    }

    get value() {
        return this.output;
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
        for (let input of inputs) {
            input.onmidimessage = this.getMIDIMessage.bind(this);
        }
    }

    private getMIDIMessage(message: WebMidi.MIDIMessageEvent) {
        const [status, data1, data2] = message.data;
        const isControlChange = (status & 0xf0) === 0xb0;
        const isTargetCC = data1 === this.cc; // Use the cc value for filtering

        if (isControlChange && isTargetCC) {
            const value = data2 / 127; // Normalize to 0-1 range
            this.output.offset.setValueAtTime(value, this.context.currentTime);
        }
    }
}