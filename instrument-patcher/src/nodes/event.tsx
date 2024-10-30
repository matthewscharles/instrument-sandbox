import React, { useState, useEffect } from 'react';
import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text, Input, Box } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';

type EventReceiverNodeData = {
    eventName: string;
    interval: number;
    label: string;
};

const eventReceiverHandles: HandleConfig[] = [
    { id: 'output', type: 'source', position: Position.Bottom }
];

function EventReceiverComponent({ id, data }: NodeProps<EventReceiverNodeData>) {
    // const { label } = data;
    const [eventName, setEventName] = useState(data.eventName || '');
    const [interval, setInterval] = useState(data.interval || 50);
    const [triggered, setTriggered] = useState(false);

    // Access the number and onChange callback from useAudioNode
    const { number, onChange } = useAudioNode(interval, id);

    // Update interval state when number changes
    useEffect(() => {
        setInterval(number);
    }, [number]);

    // Handle the visual trigger indication
    useEffect(() => {
        const handleTrigger = () => {
            setTriggered(true);
            setTimeout(() => setTriggered(false), interval);
        };

        const patcher = window.patch;
        const audioNode = patcher ? patcher[id] : undefined;

        if (audioNode) {
            audioNode.handleTrigger = handleTrigger;
            audioNode.eventName = eventName;
            audioNode.interval = interval;
        }

        // Cleanup on unmount
        return () => {
            if (audioNode) {
                audioNode.handleTrigger = undefined;
            }
        };
    }, [eventName, interval, id]);

    return (
        <Box>
            {/* <Text fontSize="small" color="black" className="obj__title">{label}</Text> */}
            <Text fontSize="small" color="black">name:</Text>
            <Input className="nodrag" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" />
            <Text fontSize="small" color="black">trigger length:</Text>
            <Input className="nodrag" type="number" value={number} onChange={onChange} placeholder="Interval" />
            {/* {triggered && <Box className="triggered-indicator">ON</Box>} */}
            {/* <Box>{triggered ? 'ON' : 'OFF'}</Box> */}
            <Box className={triggered ? 'triggered-indicator on' : 'triggered-indicator'}>{triggered ? 'ON' : 'OFF'}</Box>
        </Box>
    );
}

export const EventReceiverInit = withAudioNode(EventReceiverComponent, eventReceiverHandles);