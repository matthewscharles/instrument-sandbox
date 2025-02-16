import { useState, useCallback } from 'react';
import { EchoNode } from '../audio_nodes/EchoNode';
import { ConstantNode } from '../audio_nodes/ConstantNode';
import { CustomOscillatorNode } from '../audio_nodes/OscillatorNode';
import { CustomGainNode } from '../audio_nodes/CustomGainNode';
import { CustomFilterNode } from '../audio_nodes/CustomFilterNode';
export function useAudioNode(initialValue, id) {
    const [number, setNumber] = useState(initialValue);
    const onChange = useCallback((e) => {
        if (typeof e === 'undefined' || e === null)
            return;
        const value = parseFloat(e.target.value);
        if (isNaN(value))
            return;
        const cappedNumber = Math.min(10000, Math.max(0, value));
        setNumber(cappedNumber);
        const patcher = window.patch;
        const audioNode = patcher ? patcher[id] : undefined;
        const time = window.context.currentTime;
        if (audioNode) {
            if (audioNode instanceof ConstantNode) {
                audioNode.value.offset.value = cappedNumber;
            }
            else if (audioNode instanceof EchoNode) {
                audioNode.delay.delayTime.linearRampToValueAtTime(cappedNumber / 1000, time + 0.1);
            }
            else if (audioNode instanceof CustomFilterNode) {
                audioNode.frequency.linearRampToValueAtTime(cappedNumber, 0.1);
            }
            else if (audioNode instanceof CustomGainNode) {
                audioNode.gain.linearRampToValueAtTime(cappedNumber, time);
            }
            else if (audioNode instanceof CustomOscillatorNode) {
                audioNode.frequency.linearRampToValueAtTime(cappedNumber, time + 0.1);
            }
        }
    }, [id]);
    return { number, onChange };
}
