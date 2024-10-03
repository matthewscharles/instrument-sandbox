import React, { useEffect, useState, useCallback } from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
import { MidiControlChangeNode } from './MidiControlChangeNode';

type MidiCCNodeData = { value: number, label: string };

const constantHandles: HandleConfig[] = [
  { id: 'output', type: 'source', position: Position.Bottom }
];

function MidiCCComponent({ id, data }: NodeProps<MidiCCNodeData>) {
  const { value, label } = data;
  const { number, onChange } = useAudioNode(value, id);

  // State to track the MIDI CC lane
  const [ccLane, setCcLane] = useState(113); // Default to CC 113


  useEffect(() => {
    const patcher = (window as any).patch;
    console.log('MidiCCComponent useEffect patcher:', patcher);
    console.log('MidiCCComponent useEffect patcher[id]:', patcher[id]);
    // console.log('MidiCCComponent useEffect patcher[id].ccValue:', patcher[id].ccValue);
    if(typeof patcher[id] !== 'undefined') {
      patcher[id].ccValue = ccLane; // Update the cc lane in the MidiControlChangeNode
    }
  }, [ccLane, id]);

  const handleCcLaneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newCcLane = parseInt(e.target.value, 10);
    if (!isNaN(newCcLane)) {
      setCcLane(newCcLane);
    }
  }, []);

  return (
    <Text fontSize="small" color="black">
      {label}:
      <span>
        <label htmlFor={`cc-lane-${id}`}>CC Lane:</label>
        <input
          id={`cc-lane-${id}`}
          onChange={handleCcLaneChange}
          name="cc-lane"
          type="number"
          value={ccLane}
          min="0"
          max="127"
          step="1"
          className="nodrag"
        />
      </span>
      <span>
        <label htmlFor={`number-${id}`}>Value:</label>
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
      </span>
    </Text>
  );
}

export const MidiCCNode = withAudioNode(MidiCCComponent, constantHandles);