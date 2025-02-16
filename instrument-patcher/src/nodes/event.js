import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { Text, Input, Box } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
const eventReceiverHandles = [
    { id: 'output', type: 'source', position: Position.Bottom }
];
function EventReceiverComponent({ id, data }) {
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
    return (_jsxs(Box, { children: [_jsx(Text, { fontSize: "small", color: "black", children: "name:" }), _jsx(Input, { className: "nodrag", value: eventName, onChange: (e) => setEventName(e.target.value), placeholder: "Event Name" }), _jsx(Text, { fontSize: "small", color: "black", children: "trigger length:" }), _jsx(Input, { className: "nodrag", type: "number", value: number, onChange: onChange, placeholder: "Interval" }), _jsx(Box, { className: triggered ? 'triggered-indicator on' : 'triggered-indicator', children: triggered ? 'ON' : 'OFF' })] }));
}
export const EventReceiverInit = withAudioNode(EventReceiverComponent, eventReceiverHandles);
