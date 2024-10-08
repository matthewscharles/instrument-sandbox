import React, { useCallback, useEffect, useState } from 'react';
import { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { Box, Text } from "@chakra-ui/react";
import { useDraggable } from './useDraggable';

const leftStyle = { left: 10 };
const rightStyle = { right: 10 };

export function GainInit({
  id,
  data: { gain, label },
}: NodeProps<{ gain: number; label: string }>) {
  const { value, onMouseDown, setValue } = useDraggable({
    id,
    initialValue: gain,
    onChange: (newValue) => {
      // Specific logic moved here
      const patcher = window.patch;
      patcher[id].gain.linearRampToValueAtTime(newValue, 0.00001);
    },
  });

  const [inputValue, setInputValue] = useState<string>(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const onInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      setInputValue(inputValue);

      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue)) {
        setValue(parsedValue);
        const patcher = window.patch;
        patcher[id].gain.linearRampToValueAtTime(parsedValue, 0.00001);
      }
    },
    [id, setValue]
  );

  return (
    <Box bg="white" border="1px solid gray">
      <Box bg="beige">
        <Text fontSize="small" color="black" className="obj__title">
          gain
        </Text>
      </Box>
      <Box p={2} bg="white">
        <Text fontSize="small" color="black">
          <span
            className="nodrag"
            style={{ display: 'inline-block', cursor: 'ew-resize', marginLeft: '10px' }}
            onMouseDown={onMouseDown}
          >
            amplitude:
          </span>
          <input
            id={`number-${id}`}
            onInput={onInput}
            name="number"
            type="text"
            value={inputValue}
            className="nodrag"
          />
        </Text>
      </Box>
      <Handle
        id="input"
        type="target"
        className="handle"
        position={Position.Top}
        style={leftStyle}
      />
       <Handle
        id="gain"
        type="target"
        className="handle"
        position={Position.Top}
        style={rightStyle}
      />
      <Handle
        id="output"
        type="source"
        className="handle"
        position={Position.Bottom}
        style={rightStyle}
      />
    </Box>
  );
}