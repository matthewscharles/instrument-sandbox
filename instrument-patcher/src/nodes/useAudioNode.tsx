import { useState, useCallback } from 'react';
import * as Tone from 'tone';

export function useAudioNode(initialValue: number, id: string) {
  const [number, setNumber] = useState(initialValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    
    const cappedNumber = Math.round(
      Math.min(10000, Math.max(0, Number(e.target.value)))
    );
    
    setNumber(cappedNumber);
    const patcher = (window as any).patch;
    const audioNode = patcher[id];
    
    let timeValue = cappedNumber / 1000;
    
    
    if (audioNode instanceof Tone.Volume) {
      audioNode.volume.rampTo(cappedNumber, 0.1);
    } else if (audioNode instanceof Tone.FeedbackDelay) {
      audioNode.delayTime.rampTo(timeValue, 0.1);
    } else if (audioNode instanceof Tone.Filter) {
      audioNode.frequency.rampTo(cappedNumber, 0.1);
    } else if (audioNode instanceof Tone.Oscillator) {
      audioNode.frequency.rampTo(cappedNumber, 0.1);
    }
    
  }, [id]);

  return { number, onChange };
}