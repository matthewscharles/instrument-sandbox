import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Handle } from 'reactflow';
import { Box, Text } from "@chakra-ui/react";
export function withAudioNode(Component, handles) {
    return function WrappedComponent(props) {
        return (_jsxs(Box, { bg: "white", border: "1px solid gray", children: [_jsx(Box, { bg: "beige", children: _jsx(Text, { fontSize: "small", color: "black", className: "obj__title", children: props.data.label }) }), _jsxs(Box, { p: 2, bg: "white", children: [_jsx(Component, { ...props }), " "] }), handles.map(handle => (_jsx(Handle, { id: handle.id, type: handle.type, position: handle.position, style: handle.style }, handle.id)))] }));
    };
}
