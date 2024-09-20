import { useState, useCallback } from 'react';

export function useAudioNode(initialValue: number, id: string) {
  const [number, setNumber] = useState(initialValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const cappedNumber = Math.round(
      Math.min(10000, Math.max(0, Number(e.target.value)))
    );
    setNumber(cappedNumber);
    let patcher = (window as any).patch;
    patcher[id].volume.rampTo(cappedNumber, 0.1);
  }, [id]);

  return { number, onChange };
}