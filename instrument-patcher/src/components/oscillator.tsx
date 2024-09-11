import React from 'react';
import { NodeProps } from 'reactflow'
import { Box, Text } from "@chakra-ui/react";

export function OscillatorInit({
            data:{ frequency },
        }:NodeProps<{ frequency: number }>) {
    return (
        <Box bg="white" border="1px solid gray">
            <Box bg="beige">
                <Text fontSize="small" color="black">
                    oscillator
                </Text> 
            </Box>
            <Box p={2} bg="white">
                <Text fontSize="small" color="black">
                    frequency: {frequency}
                </Text>
            </Box>
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