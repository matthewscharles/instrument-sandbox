import React, { useCallback, useEffect, useState } from 'react';
import { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { Box, Text } from '@chakra-ui/react';
import { useDraggable } from './useDraggable';

type FilterNodeData = {
  frequency: number;
  Q: number;
  label: string;
};

export function FilterInit({
  id,
  data: { frequency, Q, label },
}: NodeProps<FilterNodeData>) {
  // Draggable control for frequency
  const {
    value: freqValue,
    onMouseDown: onMouseDownFreq,
    setValue: setFreqValue,
  } = useDraggable({
    id,
    initialValue: frequency,
    min: 20,
    max: 20000,
    step: 1,
    onChange: (newValue) => {
      const patcher = (window as any).patch;
      patcher[id].frequency.linearRampToValueAtTime(newValue, 0.00001);
    },
  });

  // State for frequency input
  const [freqInputValue, setFreqInputValue] = useState<string>(String(freqValue));

  useEffect(() => {
    setFreqInputValue(String(freqValue));
  }, [freqValue]);

  const onFreqInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      setFreqInputValue(inputValue);

      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue)) {
        setFreqValue(parsedValue);

        const patcher = (window as any).patch;
        patcher[id].frequency.linearRampToValueAtTime(parsedValue, 0.00001);
      }
    },
    [id, setFreqValue]
  );

  // Draggable control for Q
  const {
    value: qValue,
    onMouseDown: onMouseDownQ,
    setValue: setQValue,
  } = useDraggable({
    id,
    initialValue: Q,
    min: 0.1,
    max: 10,
    step: 0.01,
    onChange: (newValue) => {
      const patcher = (window as any).patch;
      patcher[id].Q.linearRampToValueAtTime(newValue, 0.00001);
    },
  });

  // State for Q input
  const [qInputValue, setQInputValue] = useState<string>(String(qValue));

  useEffect(() => {
    setQInputValue(String(qValue));
  }, [qValue]);

  const onQInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      setQInputValue(inputValue);

      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue)) {
        setQValue(parsedValue);

        const patcher = (window as any).patch;
        patcher[id].Q.linearRampToValueAtTime(parsedValue, 0.00001);
      }
    },
    [id, setQValue]
  );

  // Handle styles
  const inputHandleStyle = { left: 10, top: -3 };
  const frequencyHandleStyle = { left: 50,top: -3 };
  const qHandleStyle = { left: 90, top: -3 };
  const outputHandleStyle = { right: 10 };

  return (
    <Box bg="white" border="1px solid gray" className="obj">
      <Box bg="beige">
        <Text fontSize="small" color="black" className="obj__title">
          {label}
        </Text>
      </Box>
      <Box p={2} bg="white">
        {/* Frequency Control */}
        <Text fontSize="small" color="black">
          <span
            className="nodrag"
            style={{
              display: 'inline-block',
              cursor: 'ew-resize',
              marginLeft: '10px',
            }}
            onMouseDown={onMouseDownFreq}
          >
            frequency:
          </span>
          <input
            id={`number-freq-${id}`}
            onInput={onFreqInput}
            name="frequency"
            type="text"
            value={freqInputValue}
            className="nodrag obj__number"
          />
        </Text>

        {/* Q Control */}
        <Text fontSize="small" color="black" mt={2}>
          <span
            className="nodrag"
            style={{
              display: 'inline-block',
              cursor: 'ew-resize',
              marginLeft: '10px',
            }}
            onMouseDown={onMouseDownQ}
          >
            Q:
          </span>
          <input
            id={`number-q-${id}`}
            onInput={onQInput}
            name="Q"
            type="text"
            value={qInputValue}
            className="nodrag obj__number"
          />
        </Text>
      </Box>
      {/* Handles */}
      <Handle
        id="input"
        type="target"
        position={Position.Top}
        style={inputHandleStyle}
        className="obj__handle"
      />
      <Handle
        id="frequency"
        type="target"
        position={Position.Top}
        style={frequencyHandleStyle}
        className="obj__handle"
      />
      <Handle
        id="Q"
        type="target"
        position={Position.Top}
        style={qHandleStyle}
        className="obj__handle"
      />
      <Handle
        id="output"
        type="source"
        position={Position.Bottom}
        style={outputHandleStyle}
        className="obj__handle"
      />
    </Box>
  );
}