import { Node, Edge } from 'reactflow'

export const initialNodes : Node[] = [
  {
    id: '1',
    type: 'oscillator',
    position: { x: 250, y: 0 },
    data: { label: "oscillator", frequency: 220 },
  },
  {
    id: '4',
    type: 'oscillator',
    position: { x: 550, y: 0 },
    data: { label: "oscillator", frequency: 400 },
  },
  {
      id: '3',
      type: 'filter',
      data: { label: "filter", frequency: 100 },
      position: { x: 300, y: 200 },
  },
  {
      id: '2',
      type: 'output',
      data: { label: <div>output</div> },
      position: { x: 250, y: 350 },
  },
  {
      id: '5',
      type: 'gain',
      data: { label: <div>gain</div>, gain: 0 },
      position: { x: 550, y: 350 },
  },
  {
    id: '6',
    type: 'delay',
    data: { label: <span>delay</span>, gain: 0 },
    position: { x: 550, y: 250 },
  },
]

export const initialEdges : Edge[] = [
  { id: 'e1-3', source: '1', target: '3', animated: false, sourceHandle: 'output', targetHandle:'input' },
  { id: 'e3-2', source: '3', target: '2', animated: false, sourceHandle: 'output', targetHandle:'input' },
  { id: 'e4-2', source: '4', target: '3', animated: false, sourceHandle: 'output', targetHandle:'input' },
]