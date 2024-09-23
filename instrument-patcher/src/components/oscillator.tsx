import React, { useCallback, useState } from 'react';
import { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { Box, Text } from "@chakra-ui/react";

const leftStyle = { left: 10 };
const rightStyle = { right: 10 };

export function OscillatorInit({
  id,
  data: { frequency, label },
}: NodeProps<{ frequency: number, label: string }>) {
  const [number, setNumber] = useState(frequency);
  const [waveform, setWaveform] = useState('triangle');

  const onChangeFrequency = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const cappedNumber = Math.round(
      Math.min(10000, Math.max(0, Number(e.target.value)))
    );

    setNumber(cappedNumber);

    let patcher = (window as any).patch;
    patcher[id].frequency.rampTo(cappedNumber, 0.1);
  }, [id]);

  const onChangeWaveform = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWaveform = e.target.value;
    setWaveform(selectedWaveform);

    let patcher = (window as any).patch;
    patcher[id].type = selectedWaveform;
  }, [id]);

  return (
    <Box bg="white" border="1px solid gray">
      <Box bg="beige">
        <Text fontSize="small" color="black">
          oscillator
        </Text>
      </Box>
      <Box p={2} bg="white">
        <Text fontSize="small" color="black">
          frequency:
          <input
            id={`number-${id}`}
            onChange={onChangeFrequency}
            name="number"
            type="number"
            value={number}
            min="0"
            max="10000"
            className="nodrag"
          />
        </Text>
        <Text fontSize="small" color="black">
          waveform:
          <select
            id={`waveform-${id}`}
            onChange={onChangeWaveform}
            value={waveform}
            className="nodrag"
          >
            <option value="sine">sine</option>
            <option value="triangle">triangle</option>
            <option value="square">square</option>
            <option value="sawtooth">sawtooth</option>
          </select>
        </Text>
      </Box>
      <Handle id="frequency" type="target" className="handle" position={Position.Top} style={leftStyle} />
      <Handle id="phase" type="target" className="handle" position={Position.Top} style={rightStyle} />
      <Handle id="output" type="source" className="handle" position={Position.Bottom} />
    </Box>
  );
}