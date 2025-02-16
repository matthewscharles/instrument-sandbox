import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
import { MidiControlChangeNode } from './MidiControlChangeNode';
const constantHandles = [
    { id: 'output', type: 'source', position: Position.Bottom }
];
function ConstantComponent({ id, data }) {
    const { value, label } = data;
    const { number, onChange } = useAudioNode(value, id);
    // Initialize the MidiControlChangeNode
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const midiNode = new MidiControlChangeNode(audioContext, { value });
    // Update the value when MIDI input changes
    midiNode.output.offset.addEventListener('valuechange', (event) => {
        onChange({ target: { value: event.target.value } });
    });
    return (_jsxs(Text, { fontSize: "small", color: "black", children: ["sensor:", _jsx("input", { id: `number-${id}`, onChange: onChange, name: "number", type: "number", value: number, min: "0", max: "10000", step: "0.01", className: "nodrag" })] }));
}
export const ConstantNode = withAudioNode(ConstantComponent, constantHandles);
