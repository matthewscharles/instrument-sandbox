import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback, useRef } from 'react';
import { Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { Text } from "@chakra-ui/react";
const constantHandles = [
    { id: 'output', type: 'source', position: Position.Bottom }
];
function MidiCCComponent({ id, data }) {
    // const { value, label } = data;
    const { value } = data;
    const [number, setNumber] = useState(value);
    const [ccLane, setCcLane] = useState(0); // Default to CC 0
    const handleMidiCCChangeRef = useRef();
    // Event listener to update the value state
    const handleMidiCCChange = useCallback((event) => {
        const patcher = window.patch;
        // console.log('MidiCCNode', id, number, event.detail.ccLane, ccLane, event.detail.value);
        if (patcher && patcher[id]) {
            const identifier = patcher[id].displayId;
            if (event.detail.identifier === identifier) {
                const newValue = event.detail.value;
                if (newValue !== number && event.detail.ccLane === ccLane) {
                    setNumber(newValue);
                }
            }
        }
    }, [id, number, ccLane]);
    // Store the latest version of the callback in the ref
    useEffect(() => {
        handleMidiCCChangeRef.current = handleMidiCCChange;
    }, [handleMidiCCChange]);
    // Add the event listener once when the component is mounted
    useEffect(() => {
        const eventListener = (event) => {
            if (handleMidiCCChangeRef.current) {
                handleMidiCCChangeRef.current(event);
            }
        };
        window.addEventListener('midi-cc-change', eventListener);
        return () => {
            window.removeEventListener('midi-cc-change', eventListener);
        };
    }, []);
    useEffect(() => {
        const patcher = window.patch;
        if (patcher && patcher[id]) {
            patcher[id].ccLane = ccLane; // Update the cc lane in the MidiControlChangeNode
        }
    }, [ccLane, id]);
    const handleCcLaneChange = useCallback((e) => {
        const newCcLane = parseInt(e.target.value, 10);
        if (!isNaN(newCcLane)) {
            setCcLane(newCcLane);
        }
    }, []);
    return (_jsxs(Text, { fontSize: "small", color: "black", className: "obj__contents", children: [_jsxs("span", { children: [_jsx("label", { htmlFor: `cc-lane-${id}`, children: "Sensor" }), _jsx("input", { id: `cc-lane-${id}`, onChange: handleCcLaneChange, name: "cc-lane", type: "number", value: ccLane, min: "0", max: "127", step: "1", className: "nodrag" })] }), _jsxs("span", { children: [_jsx("label", { htmlFor: `value-${id}`, children: "Value" }), _jsx("input", { id: `value-${id}`, name: "value", type: "number", value: number.toFixed(2), readOnly: true, className: "nodrag obj__number" })] }), _jsx("span", { children: _jsx("progress", { value: number, max: "127", style: { width: '100%' } }) })] }));
}
export const MidiCCNode = withAudioNode(MidiCCComponent, constantHandles);
