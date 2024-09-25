import React from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';

type DustNodeData = { value: number, label: string };

const constantHandles: HandleConfig[] = [
  { id: 'output', type: 'source', position: Position.Bottom }
];

function DustComponent({ id, data }: NodeProps<DustNodeData>) {
  const { value, label } = data;
  const { number, onChange } = useAudioNode(value, id);

  return (
    <Text fontSize="small" color="black">
     .........................
    </Text>
  );
}

export const DustNode = withAudioNode(DustComponent, constantHandles);