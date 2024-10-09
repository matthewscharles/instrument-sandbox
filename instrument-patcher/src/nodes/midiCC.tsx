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
  const [ccLane, setCcLane] = useState(0); // Default to CC 0
  
  // Event listener to update the number state
    const handleMidiCCChange = (event: CustomEvent) => {
      const patcher = window.patch;
      const identifier = patcher[id].displayId;
      if (event.detail.identifier === identifier) {
        console.log('MIDI CC change', event.detail);
        const newValue = event.detail.value;
        if (newValue !== number) {
          // onChange(newValue);
          // document.querySelector(`#value-${id}`)?.setAttribute('value', String(newValue));
        }
      }
    };

    window.addEventListener('midi-cc-change', handleMidiCCChange as EventListener);

  

  useEffect(() => {
    const patcher = window.patch;
    if (typeof patcher[id] !== 'undefined') {
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
    <Text fontSize="small" color="black">
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
          value={number}
          readOnly
          className="nodrag"
        />
      </span>
    </Text>
  );
}

export const MidiCCNode = withAudioNode(MidiCCComponent, constantHandles);