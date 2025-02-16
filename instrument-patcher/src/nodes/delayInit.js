import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
const delayHandles = [
    { id: 'input', type: 'target', position: Position.Top, style: { left: 10 } },
    { id: 'time', type: 'target', position: Position.Top, style: { left: 50 } },
    { id: 'feedback', type: 'target', position: Position.Top, style: { left: 80 } },
    { id: 'output', type: 'source', position: Position.Bottom }
];
function DelayComponent({ id, data }) {
    // const { time, label } = data;
    const { time } = data;
    const { number, onChange } = useAudioNode(time, id);
    return (_jsxs(Text, { fontSize: "small", color: "black", children: ["delay:", _jsx("input", { id: `number-${id}`, onChange: onChange, name: "number", type: "number", value: number, min: "0", max: "10000", 
                // step="0.01"
                className: "nodrag" })] }));
}
export const DelayInit = withAudioNode(DelayComponent, delayHandles);
