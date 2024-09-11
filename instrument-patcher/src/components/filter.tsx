import React from 'react';
import { NodeProps} from 'reactflow'
import { Handle, Position } from 'reactflow'
import { Box, Text } from "@chakra-ui/react";
import { useCallback, useState } from 'react';

const leftStyle = { left: 10 };
const rightStyle = { right: 10 };

export function FilterInit({
            id,
            data:{ frequency, label },
        }:NodeProps<{ frequency: number, label:string }>) {
            
            const [number, setNumber] = useState(frequency);

            const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const cappedNumber = Math.round( 
                    Math.min(10000, Math.max(0, Number(e.target.value)))
                );
                setNumber(cappedNumber);
            }, []);
            
    return (
        <Box bg="white" border="1px solid gray">
            <Box bg="beige">
                <Text fontSize="small" color="black">
                    filter
                </Text> 
            </Box>
            <Box p={2} bg="white">
                <Text fontSize="small" color="black">
                    frequency: 
                    <input
                        id={`number-${id}`} 
                        onChange={onChange} 
                        name="number"
                        type="number" 
                        value={number} 
                        min="0" 
                        max="10000" 
                        className="nodrag"></input>
                </Text>
            </Box>
            <Handle id="a" type="target" className="handle" position={Position.Top} style={leftStyle} />
            <Handle id="b" type="target" className="handle" position={Position.Top} style={rightStyle} />
            <Handle id="c" type="source" className="handle" position={Position.Bottom} />
            <Handle id="d" type="source" className="handle" position={Position.Bottom} />
        </Box>
    )
}