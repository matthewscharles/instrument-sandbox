import React from 'react';
import { NodeProps} from 'reactflow'
import { Handle, Position } from 'reactflow'
import { Box, Text } from "@chakra-ui/react";
import { useCallback, useState } from 'react';

const leftStyle = { left: 10 };
const rightStyle = { right: 10 };

export function GainInit({
            id,
            data:{ gain, label },
        }:NodeProps<{ gain: number, label:string }>) {
            
            const [number, setNumber] = useState(gain);

            const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const cappedNumber = Math.round( 
                    Math.min(10000, Math.max(0, Number(e.target.value)))
                );
                setNumber(cappedNumber);
                let patcher = (window as any).patch;
                // console.log(cappedNumber);
                patcher[id].gain.linearRampToValueAtTime(cappedNumber, 0.00001);
            }, []);
            
    return (
        <Box bg="white" border="1px solid gray">
            <Box bg="beige">
                <Text fontSize="small" color="black" className="obj__title">
                    gain
                </Text> 
            </Box>
            <Box p={2} bg="white">
                <Text fontSize="small" color="black">
                amplitude: 
                    <input
                        id={`number-${id}`} 
                        onChange={onChange} 
                        name="number"
                        type="number" 
                        value={number} 
                        min="0" 
                        max="10000" 
                        // step="0.01"
                        className="nodrag"></input>
                </Text>
            </Box>
            <Handle id="input" type="target" className="handle" position={Position.Top} style={leftStyle} />
            <Handle id="gain" type="target" className="handle" position={Position.Top} style={rightStyle} />
            <Handle id="output" type="source" className="handle" position={Position.Bottom} />
        </Box>
    )
}