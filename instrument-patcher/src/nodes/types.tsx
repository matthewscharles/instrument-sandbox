import { Position } from 'reactflow';

export type HandleConfig = {
  id: string;
  type: 'source' | 'target';
  position: Position;
  style?: React.CSSProperties;
};