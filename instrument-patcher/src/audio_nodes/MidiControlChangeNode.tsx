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
    id: string;

    constructor(context: AudioContext, options: MidiControlChangeNodeOptions = {}) {
        super(context);
        this.context = context;
        this.initialized = true;
        this.cc = options.cc || 0; 
        this.id = `midi-cc-${Math.random().toString(36).substr(2, 9)}`; // Generate a unique ID

        this.input = new GainNode(context);
        this.output = new ConstantSourceNode(context, { offset: options.value || 0 });
        this.output.start();
        this.input.connect(this.output.offset);

        this.initMIDI();
    }

    get value() {
        return this.output.offset;
    }

    get identifier() {
        return this.id;
    }

    initMIDI() {
        navigator.requestMIDIAccess().then((access) => {
            access.inputs.forEach((input) => {
                input.onmidimessage = this.getMIDIMessage.bind(this);
            });
        });
    }

    getMIDIMessage(message: any) {
      
        const [status, data1, data2] = message.data;
        const isControlChange = (status & 0xf0) === 0xb0;
        const isTargetCC = data1 === this.cc; // Use the cc value for filtering
        // console.log(`isControlChange: ${isControlChange}, isTargetCC: ${isTargetCC}`, this.cc, data1);
        if (isControlChange && isTargetCC) {
            console.log(`CC ${data1}: ${data2}`);
            
            const newValue = data2 / 127; // Assuming the value is in the third byte
            if (newValue !== this.output.offset.value) {
                this.output.offset.value = newValue;
                const event = new CustomEvent('midi-cc-change', {
                    detail: { displayId: this.id, ccLane:this.cc, value: newValue },
                });
                
                window.dispatchEvent(event);
            }
        
        }
    }
}