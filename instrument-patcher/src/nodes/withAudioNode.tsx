import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Box, Text } from "@chakra-ui/react";
import { HandleConfig } from './types';

type AudioNodeProps<T> = NodeProps<T & { label: string }>;

interface WithAudioNodeProps<T> extends AudioNodeProps<T> {}

export function withAudioNode<T>(
  Component: React.ComponentType<AudioNodeProps<T>>,
  handles: HandleConfig[]
) {
  return function WrappedComponent(props: WithAudioNodeProps<T>) {
    return (
      <Box bg="white" border="1px solid gray">
        <Box bg="beige">
          <Text fontSize="small" color="black">
            {props.data.label}
          </Text>
        </Box>
        <Box p={2} bg="white">
          <Component {...props} /> {/* Pass only the expected props */}
        </Box>
        {handles.map(handle => (
          <Handle
            key={handle.id}
            id={handle.id}
            type={handle.type}
            position={handle.position}
            style={handle.style}
          />
        ))}
      </Box>
    );
  };
}