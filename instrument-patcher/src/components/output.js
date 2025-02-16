import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Handle, Position } from 'reactflow';
import { Box, Text } from "@chakra-ui/react";
const leftStyle = { left: 10 };
const rightStyle = { right: 10 };
export function OutputInit({ id }) {
    return (_jsxs(Box, { bg: "white", border: "1px solid gray", children: [_jsx(Box, { bg: "beige", children: _jsx(Text, { fontSize: "small", color: "black", className: "obj__title", children: "output" }) }), _jsx(Handle, { id: "input", type: "target", className: "handle", position: Position.Top, style: leftStyle })] }));
}
