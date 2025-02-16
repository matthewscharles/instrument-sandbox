import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Text } from '@chakra-ui/react';
import { useDraggable } from './useDraggable';
export function FilterInit({ id, data: { frequency, Q, label }, }) {
    // Draggable control for frequency
    const { value: freqValue, onMouseDown: onMouseDownFreq, setValue: setFreqValue, } = useDraggable({
        id,
        initialValue: frequency,
        min: 20,
        max: 20000,
        step: 1,
        onChange: (newValue) => {
            const patcher = window.patch;
            patcher[id].frequency.linearRampToValueAtTime(newValue, 0.00001);
        },
    });
    // State for frequency input
    const [freqInputValue, setFreqInputValue] = useState(String(freqValue));
    useEffect(() => {
        setFreqInputValue(String(freqValue));
    }, [freqValue]);
    const onFreqInput = useCallback((e) => {
        const inputValue = e.currentTarget.value;
        setFreqInputValue(inputValue);
        const parsedValue = parseFloat(inputValue);
        if (!isNaN(parsedValue)) {
            setFreqValue(parsedValue);
            const patcher = window.patch;
            patcher[id].frequency.linearRampToValueAtTime(parsedValue, 0.00001);
        }
    }, [id, setFreqValue]);
    // Draggable control for Q
    const { value: qValue, onMouseDown: onMouseDownQ, setValue: setQValue, } = useDraggable({
        id,
        initialValue: Q,
        min: 0.1,
        max: 10,
        step: 0.01,
        onChange: (newValue) => {
            const patcher = window.patch;
            patcher[id].Q.linearRampToValueAtTime(newValue, 0.00001);
        },
    });
    // State for Q input
    const [qInputValue, setQInputValue] = useState(String(qValue));
    useEffect(() => {
        setQInputValue(String(qValue));
    }, [qValue]);
    const onQInput = useCallback((e) => {
        const inputValue = e.currentTarget.value;
        setQInputValue(inputValue);
        const parsedValue = parseFloat(inputValue);
        if (!isNaN(parsedValue)) {
            setQValue(parsedValue);
            const patcher = window.patch;
            patcher[id].Q.linearRampToValueAtTime(parsedValue, 0.00001);
        }
    }, [id, setQValue]);
    // Handle styles
    const inputHandleStyle = { left: 10, top: -3 };
    const frequencyHandleStyle = { left: 50, top: -3 };
    const qHandleStyle = { left: 90, top: -3 };
    const outputHandleStyle = { right: 10 };
    return (_jsxs(Box, { bg: "white", border: "1px solid gray", className: "obj", children: [_jsx(Box, { bg: "beige", children: _jsx(Text, { fontSize: "small", color: "black", className: "obj__title", children: label }) }), _jsxs(Box, { p: 2, bg: "white", children: [_jsxs(Text, { fontSize: "small", color: "black", children: [_jsx("span", { className: "nodrag", style: {
                                    display: 'inline-block',
                                    cursor: 'ew-resize',
                                    marginLeft: '10px',
                                }, onMouseDown: onMouseDownFreq, children: "frequency:" }), _jsx("input", { id: `number-freq-${id}`, onInput: onFreqInput, name: "frequency", type: "text", value: freqInputValue, className: "nodrag obj__number" })] }), _jsxs(Text, { fontSize: "small", color: "black", mt: 2, children: [_jsx("span", { className: "nodrag", style: {
                                    display: 'inline-block',
                                    cursor: 'ew-resize',
                                    marginLeft: '10px',
                                }, onMouseDown: onMouseDownQ, children: "Q:" }), _jsx("input", { id: `number-q-${id}`, onInput: onQInput, name: "Q", type: "text", value: qInputValue, className: "nodrag obj__number" })] })] }), _jsx(Handle, { id: "input", type: "target", position: Position.Top, style: inputHandleStyle, className: "obj__handle" }), _jsx(Handle, { id: "frequency", type: "target", position: Position.Top, style: frequencyHandleStyle, className: "obj__handle" }), _jsx(Handle, { id: "Q", type: "target", position: Position.Top, style: qHandleStyle, className: "obj__handle" }), _jsx(Handle, { id: "output", type: "source", position: Position.Bottom, style: outputHandleStyle, className: "obj__handle" })] }));
}
