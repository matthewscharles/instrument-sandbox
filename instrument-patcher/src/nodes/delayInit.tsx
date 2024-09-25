import React, { useCallback, useState } from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';

type DelayNodeData = { time: number, label: string };

const delayHandles: HandleConfig[] = [
  { id: 'input', type: 'target', position: Position.Top, style: { left: 10 } },
  { id: 'time', type: 'target', position: Position.Top, style: { left: 50 } },
  { id: 'feedback', type: 'target', position: Position.Top, style: { left: 80 } },
  { id: 'output', type: 'source', position: Position.Bottom }
];

function DelayComponent({ id, data }: NodeProps<DelayNodeData>) {
  const { time, label } = data;
  const { number, onChange } = useAudioNode(time, id);

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
        // step="0.01"
        className="nodrag"
      />
    </Text>
  );
}

export const DelayInit = withAudioNode(DelayComponent, delayHandles);