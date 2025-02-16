import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
const sampleHoldHandles = [
    { id: 'input', type: 'target', position: Position.Top, style: { left: 10 } },
    { id: 'trigger', type: 'target', position: Position.Top, style: { left: 50 } },
    { id: 'output', type: 'source', position: Position.Bottom }
];
function SampleHoldComponent({ id, data }) {
    const { label } = data;
    const { number, onChange } = useAudioNode(0, id); // Assuming 0 is the initial value for the node
    return (_jsxs(Text, { fontSize: "small", color: "black", children: ["threshold:", _jsx("input", { id: `number-${id}`, onChange: onChange, name: "number", type: "number", value: number, min: "0", max: "10000", step: "0.01", className: "nodrag" })] }));
}
export const SampleHoldInit = withAudioNode(SampleHoldComponent, sampleHoldHandles);
