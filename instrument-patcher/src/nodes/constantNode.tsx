// import React from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';

type ConstantNodeData = { value: number, label: string };

const constantHandles: HandleConfig[] = [
  { id: 'output', type: 'source', position: Position.Bottom }
];

function ConstantComponent({ id, data }: NodeProps<ConstantNodeData>) {
  const { value, label } = data;
  const { number, onChange } = useAudioNode(value, id);

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