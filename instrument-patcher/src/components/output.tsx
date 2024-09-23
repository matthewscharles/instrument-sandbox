import React from 'react';
import { NodeProps} from 'reactflow'
import { Handle, Position } from 'reactflow'
import { Box, Text } from "@chakra-ui/react";
import { useCallback, useState } from 'react';

const leftStyle = { left: 10 };
const rightStyle = { right: 10 };

export function OutputInit({
            id
            
        }) {
            
    return (
        <Box bg="white" border="1px solid gray">
            <Box bg="beige">
                <Text fontSize="small" color="black" className="obj__title">
                    output
                </Text> 
            </Box>
            <Handle id="input" type="target" className="handle" position={Position.Top} style={leftStyle} />
        </Box>
    )
}