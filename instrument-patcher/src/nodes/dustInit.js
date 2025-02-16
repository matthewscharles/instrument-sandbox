import { jsx as _jsx } from "react/jsx-runtime";
import { Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { Text } from "@chakra-ui/react";
const constantHandles = [
    { id: 'input', type: 'target', position: Position.Top }, // Add input handle
    { id: 'output', type: 'source', position: Position.Bottom }
];
function DustComponent({ id, data }) {
    //   const { value, label } = data;
    //   const { number, onChange } = useAudioNode(value, id);
    return (_jsx(Text, { fontSize: "small", color: "black", children: "........................." }));
}
export const DustNode = withAudioNode(DustComponent, constantHandles);
