// import React from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
// import * as Tone from 'tone';

type ConstantNodeData = { value: number, label: string };

const constantHandles: HandleConfig[] = [
  { id: 'output', type: 'source', position: Position.Bottom }
];

function ConstantComponent({ id, data }: NodeProps<ConstantNodeData>) {
  const { value, label } = data;
  const { number, onChange } = useAudioNode(value, id);

//   // Create a constant signal using Tone.js
//   const constantSignal = new Tone.Signal(value);

//   // Update the constant signal value when the number changes
//   React.useEffect(() => {
//     constantSignal.value = number;
//   }, [number, constantSignal]);

  return (
    <Text fontSize="small" color="black">
      {label}:
      <input
        id={`number-${id}`}
        onChange={onChange}
        name="number"
        type="number"
        value={number}
        min="0"
        max="10000"
        step="0.01"
        className="nodrag"
      />
    </Text>
  );
}

export const ConstantNode = withAudioNode(ConstantComponent, constantHandles);