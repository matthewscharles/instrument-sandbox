import { useState, useCallback } from 'react';
import { Volume, FeedbackDelay, Oscillator, Signal, Filter } from 'tone';
import { EchoNode } from '../audio_nodes/EchoNode';
import { ConstantNode } from '../audio_nodes/ConstantNode';
import { CustomOscillatorNode } from '../audio_nodes/OscillatorNode';

export function useAudioNode(initialValue: number, id: string) {
  const [number, setNumber] = useState(initialValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    if (isNaN(value)) return;

    const cappedNumber = Math.min(10000, Math.max(0, value));
    setNumber(cappedNumber);

    const patcher = (window as any).patch;
    const audioNode = patcher ? patcher[id] : undefined;
    
    const time = (window as any).context.currentTime;
    
    if (audioNode) {
      if (audioNode instanceof ConstantNode) {
        audioNode.value.offset.value = cappedNumber;
      } else if (audioNode instanceof EchoNode) {
        audioNode.delay.delayTime.linearRampToValueAtTime(cappedNumber / 1000, time + 0.1);
      } else if (audioNode instanceof FeedbackDelay) {
        audioNode.delayTime.rampTo(cappedNumber / 1000, 0.1);
      } else if (audioNode instanceof Volume) {
        audioNode.volume.rampTo(cappedNumber, 0.1);
      } else if (audioNode instanceof Filter) {
        audioNode.frequency.rampTo(cappedNumber, 0.1);
      } else if (audioNode instanceof Oscillator) {
        audioNode.frequency.rampTo(cappedNumber, 0.1);
      } else if (audioNode instanceof CustomOscillatorNode) {
        audioNode.frequency.linearRampToValueAtTime(cappedNumber, time + 0.1);
      } else if (audioNode instanceof Signal) {
        audioNode.rampTo(cappedNumber, 0.1);
      }
    }
  }, [id]);

  return { number, onChange };
}