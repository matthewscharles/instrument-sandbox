import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow'
import { Box, Text } from "@chakra-ui/react";
import { useCallback, useState } from 'react';


export function OscillatorInit({
            id,
            data:{ frequency, label },
        }:NodeProps<{ frequency: number, label:string }>) {
            const [number, setNumber] = useState(0);


            const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const cappedNumber = Math.round( Math.min(100, Math.max(0, Number(e.target.value))));
                setNumber(cappedNumber);
            }, []);
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
                        onChange={onChange} 
                        name="number"
                        type="number" 
                        value={frequency} 
                        min="0" 
                        max="255" 
                        className="nodrag"></input>
                </Text>
            </Box>
            <Handle type="source" className="handle" position={Position.Bottom} />
            <Handle type="source" className="handle" position={Position.Bottom} />
        </Box>
    )
}

// interface OscillatorProps {
//     data: {
//         frequency: number;
//     }
// }

// export default function OscillatorInit({
//             data:{ frequency },
//         }: OscillatorProps) {
//     return (
//         <div>
//             <h1>oscillator</h1>
//         </div>
//     )
// }