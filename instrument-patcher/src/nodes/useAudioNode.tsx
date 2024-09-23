import { useState, useCallback } from 'react';
import * as Tone from 'tone';

export function useAudioNode(initialValue: number, id: string) {
  const [number, setNumber] = useState(initialValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) return; // Prevent setting NaN values

    const cappedNumber = Math.min(10000, Math.max(0, value));
    setNumber(cappedNumber);

    const patcher = (window as any).patch;
    const audioNode = patcher ? patcher[id] : undefined;

    if (audioNode) {
      if (audioNode instanceof Tone.Volume) {
        audioNode.volume.rampTo(cappedNumber, 0.1);
      } else if (audioNode instanceof Tone.FeedbackDelay) {
        audioNode.delayTime.rampTo(cappedNumber / 1000, 0.1);
      } else if (audioNode instanceof Tone.Filter) {
        audioNode.frequency.rampTo(cappedNumber, 0.1);
      } else if (audioNode instanceof Tone.Oscillator) {
        audioNode.frequency.rampTo(cappedNumber, 0.1);
      } else if (audioNode instanceof Tone.Signal) {
        audioNode.rampTo(cappedNumber, 0.1);
      }
      
    }
  }, [id]);

  return { number, onChange };
}