import React from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
import { SampleHoldNode } from './SampleHoldNode';

type SampleHoldNodeData = { label: string };

const sampleHoldHandles: HandleConfig[] = [
  { id: 'input', type: 'target', position: Position.Top, style: { left: 10 } },
  { id: 'trigger', type: 'target', position: Position.Top, style: { left: 50 } },
  { id: 'output', type: 'source', position: Position.Bottom }
];

function SampleHoldComponent({ id, data }: NodeProps<SampleHoldNodeData>) {
  const { label } = data;
  const { number, onChange } = useAudioNode(0, id); // Assuming 0 is the initial value for the node

  return (
    <Text fontSize="small" color="black">
      threshold:
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

export const SampleHoldInit = withAudioNode(SampleHoldComponent, sampleHoldHandles);