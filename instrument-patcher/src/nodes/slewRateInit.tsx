import React from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
import { SlewRateNode } from './SlewRateNode';

type SlewRateNodeData = { label: string };

const slewRateHandles: HandleConfig[] = [
  { id: 'input', type: 'target', position: Position.Top, style: { left: 10 } },
  { id: 'rise', type: 'target', position: Position.Top, style: { left: 50 } },
  { id: 'fall', type: 'target', position: Position.Top, style: { left: 90 } },
  { id: 'output', type: 'source', position: Position.Bottom }
];

function SlewRateComponent({ id, data }: NodeProps<SlewRateNodeData>) {
  const { label } = data;
  const { number, onChange } = useAudioNode(0, id); // Assuming 0 is the initial value for the node

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

export const SlewRateInit = withAudioNode(SlewRateComponent, slewRateHandles);