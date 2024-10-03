import { NodeProps, Position } from 'reactflow';
import { withAudioNode } from './withAudioNode';
import { HandleConfig } from './types';
import { Text } from "@chakra-ui/react";
import { useAudioNode } from './useAudioNode';
import { MidiControlChangeNode } from './MidiControlChangeNode';

type ConstantNodeData = { value: number, label: string };

const constantHandles: HandleConfig[] = [
  { id: 'output', type: 'source', position: Position.Bottom }
];

function ConstantComponent({ id, data }: NodeProps<ConstantNodeData>) {
  const { value, label } = data;
  const { number, onChange } = useAudioNode(value, id);

  // Initialize the MidiControlChangeNode
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const midiNode = new MidiControlChangeNode(audioContext, { value });

  // Update the value when MIDI input changes
  midiNode.output.offset.addEventListener('valuechange', (event: any) => {
    onChange({ target: { value: event.target.value } });
  });

  return (
    <Text fontSize="small" color="black">
      {label}:
      <input
        id={`number-${id}`}
        onChange={onChange}
        name="number"
        type="number"
        value={number}
        min="0"
        max="10000"
        step="0.01"
        className="nodrag"
      />
    </Text>
  );
}

export const ConstantNode = withAudioNode(ConstantComponent, constantHandles);