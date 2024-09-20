import React from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { useAudioNode } from './useAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";

type DelayNodeData = { delay: number, label: string };

const delayHandles: HandleConfig[] = [
  { id: 'input', type: 'target', position: Position.Top, style: { left: 10 } },
  { id: 'output', type: 'source', position: Position.Bottom }
];

function DelayComponent({ id, data }: NodeProps<DelayNodeData>) {
  const { delay, label } = data;
  const { number, onChange } = useAudioNode(delay, id);

  return (
    <Text fontSize="small" color="black">
      delay:
      <input
        id={`number-${id}`}
        onChange={onChange}
        name="number"
        type="number"
        value={number}
        min="0"
        max="10000"
        className="nodrag"
      />
    </Text>
  );
}

export const DelayInit = withAudioNode(DelayComponent, delayHandles);