import React, { useEffect, useState, useCallback } from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
// import { MidiControlChangeNode } from './MidiControlChangeNode';

type MidiCCNodeData = { value: number, label: string };

const constantHandles: HandleConfig[] = [
  { id: 'output', type: 'source', position: Position.Bottom }
];

function MidiCCComponent({ id, data }: NodeProps<MidiCCNodeData>) {
  const { value, label } = data;
  const [number, setNumber] = useState(value);
  const [ccLane, setCcLane] = useState(0); // Default to CC 0

  // Event listener to update the number state
  const handleMidiCCChange = useCallback((event: CustomEvent) => {
    const patcher = window.patch;
    console.log('MidiCCNode', id, number, event.detail.ccLane, ccLane, event.detail.value);
    if (patcher && patcher[id]) {
      const identifier = patcher[id].displayId;
      if (event.detail.identifier === identifier) {
        const newValue = event.detail.value;
        if (newValue !== number && event.detail.ccLane === ccLane) {
          setNumber(newValue);
        }
      }
    }
  }, [id, number]);

  useEffect(() => {
    window.addEventListener('midi-cc-change', handleMidiCCChange as EventListener);

    return () => {
      window.removeEventListener('midi-cc-change', handleMidiCCChange as EventListener);
    };
  }, [handleMidiCCChange]);

  useEffect(() => {
    const patcher = window.patch;
    if (patcher && patcher[id]) {
      patcher[id].ccLane = ccLane; // Update the cc lane in the MidiControlChangeNode
    }
  }, [ccLane, id]);

  const handleCcLaneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newCcLane = parseInt(e.target.value, 10);
    if (!isNaN(newCcLane)) {
      setCcLane(newCcLane);
    }
  }, []);

  return (
    <Text fontSize="small" color="black" className="obj__contents">
      <span>
        <label htmlFor={`cc-lane-${id}`}>Sensor</label>
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
        <label htmlFor={`value-${id}`}>Value</label>
        <input
          id={`value-${id}`}
          name="value"
          type="number"
          value={number.toFixed(2)}
          readOnly
          className="nodrag obj__number"
        />
      </span>
      <span>
        <progress value={number * 127} max="127" style={{ width: '100%' }}></progress>
      </span>
    </Text>
  );
}

export const MidiCCNode = withAudioNode(MidiCCComponent, constantHandles);