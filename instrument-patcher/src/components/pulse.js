import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Text } from "@chakra-ui/react";
const leftStyle = { left: 10 };
const rightStyle = { right: 10 };
export function PulseInit({ id, data: { frequency, label }, }) {
    const [number, setNumber] = useState(frequency);
    const [waveform, setWaveform] = useState('triangle');
    const onChangeFrequency = useCallback((e) => {
        const cappedNumber = Math.round(Math.min(10000, Math.max(0, Number(e.target.value))));
        setNumber(cappedNumber);
        let patcher = window.patch;
        patcher[id].frequency.linearRampToValueAtTime(cappedNumber, 0.1);
    }, [id]);
    return (_jsxs(Box, { bg: "white", border: "1px solid gray", children: [_jsx(Box, { bg: "beige", children: _jsx(Text, { fontSize: "small", color: "black", className: "obj__title", children: "Pulse" }) }), _jsx(Box, { p: 2, bg: "white", children: _jsxs(Text, { fontSize: "small", color: "black", children: ["frequency:", _jsx("input", { id: `number-${id}`, onChange: onChangeFrequency, name: "number", type: "number", value: number, min: "0", max: "10000", className: "nodrag" })] }) }), _jsx(Handle, { id: "frequency", type: "target", className: "handle", position: Position.Top, style: leftStyle }), _jsx(Handle, { id: "phase", type: "target", className: "handle", position: Position.Top, style: rightStyle }), _jsx(Handle, { id: "output", type: "source", className: "handle", position: Position.Bottom })] }));
}
