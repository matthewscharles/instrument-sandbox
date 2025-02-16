import { jsx as _jsx } from "react/jsx-runtime";
import { Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
const constantHandles = [
    { id: 'output', type: 'source', position: Position.Bottom }
];
function NoiseComponent({ id, data }) {
    const { value, label } = data;
    const { number, onChange } = useAudioNode(value, id);
    return (_jsx(Text, { fontSize: "small", color: "black", children: "#@$%^&*^$#@" }));
}
export const NoiseNode = withAudioNode(NoiseComponent, constantHandles);
