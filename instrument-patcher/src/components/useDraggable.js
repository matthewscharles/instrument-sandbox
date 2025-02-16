import { useState, useCallback, useEffect } from 'react';
export function useDraggable({ id, initialValue, min = 0, max = 10000, step = 0.01, onChange, }) {
    const [value, setValue] = useState(initialValue);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startValue, setStartValue] = useState(initialValue);
    const onMouseDown = useCallback((e) => {
        setDragging(true);
        setStartX(e.clientX);
        setStartValue(value);
        e.preventDefault();
    }, [value]);
    const onMouseMove = useCallback((e) => {
        if (dragging) {
            const deltaX = e.clientX - startX;
            let newValue = startValue + deltaX * step;
            newValue = Math.min(max, Math.max(min, newValue));
            newValue = parseFloat(newValue.toFixed(2));
            setValue(newValue);
            // Invoke the onChange callback
            if (onChange) {
                onChange(newValue);
            }
        }
    }, [dragging, startX, startValue, min, max, step, onChange]);
    const onMouseUp = useCallback(() => {
        setDragging(false);
    }, []);
    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [dragging, onMouseMove, onMouseUp]);
    return { value, onMouseDown, setValue };
}
