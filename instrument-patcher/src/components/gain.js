import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Text } from "@chakra-ui/react";
import { useDraggable } from './useDraggable';
const leftStyle = { left: 10 };
const rightStyle = { right: 10 };
export function GainInit({ id, data: { gain, label }, }) {
    const { value, onMouseDown, setValue } = useDraggable({
        id,
        initialValue: gain,
        onChange: (newValue) => {
            // Specific logic moved here
            const patcher = window.patch;
            patcher[id].gain.linearRampToValueAtTime(newValue, 0.00001);
        },
    });
    const [inputValue, setInputValue] = useState(String(value));
    useEffect(() => {
        setInputValue(String(value));
    }, [value]);
    const onInput = useCallback((e) => {
        const inputValue = e.currentTarget.value;
        setInputValue(inputValue);
        const parsedValue = parseFloat(inputValue);
        if (!isNaN(parsedValue)) {
            setValue(parsedValue);
            const patcher = window.patch;
            patcher[id].gain.linearRampToValueAtTime(parsedValue, 0.00001);
        }
    }, [id, setValue]);
    return (_jsxs(Box, { bg: "white", border: "1px solid gray", children: [_jsx(Box, { bg: "beige", children: _jsx(Text, { fontSize: "small", color: "black", className: "obj__title", children: "gain" }) }), _jsx(Box, { p: 2, bg: "white", children: _jsxs(Text, { fontSize: "small", color: "black", children: [_jsx("span", { className: "nodrag", style: { display: 'inline-block', cursor: 'ew-resize', marginLeft: '10px' }, onMouseDown: onMouseDown, children: "amplitude:" }), _jsx("input", { id: `number-${id}`, onInput: onInput, name: "number", type: "text", value: inputValue, className: "nodrag" })] }) }), _jsx(Handle, { id: "input", type: "target", className: "handle", position: Position.Top, style: leftStyle }), _jsx(Handle, { id: "gain", type: "target", className: "handle", position: Position.Top, style: rightStyle }), _jsx(Handle, { id: "output", type: "source", className: "handle", position: Position.Bottom, style: rightStyle })] }));
}
