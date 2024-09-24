import React from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';

type NoiseNodeData = { value: number, label: string };

const constantHandles: HandleConfig[] = [
  { id: 'output', type: 'source', position: Position.Bottom }
];

function NoiseComponent({ id, data }: NodeProps<NoiseNodeData>) {
  const { value, label } = data;
  const { number, onChange } = useAudioNode(value, id);

  return (
    <Text fontSize="small" color="black">
     #@$%^&*^$#@
    </Text>
  );
}

export const NoiseNode = withAudioNode(NoiseComponent, constantHandles);