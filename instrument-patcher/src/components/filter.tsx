import React from 'react';
import { NodeProps} from 'reactflow'
import { Handle, Position } from 'reactflow'
import { Box, Text } from "@chakra-ui/react";
import { useCallback, useState } from 'react';

const leftStyle = { left: 10 };
const rightStyle = { left: 40 }; 

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
                let patcher = (window as any).patch;
                patcher[id].frequency.linearRampToValueAtTime(cappedNumber, 0.1);
            }, []);
            
    return (
        <Box bg="white" border="1px solid gray">
            <Box bg="beige">
                <Text fontSize="small" color="black" className="obj__title">
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
            <Handle id="input" type="target" className="handle" position={Position.Top} style={leftStyle} />
            <Handle id="frequency" type="target" className="handle" position={Position.Top} style={rightStyle} />
            <Handle id="Q" type="target" className="handle" position={Position.Top} />
            <Handle id="output" type="source" className="handle" position={Position.Bottom} />
        </Box>
    )
}