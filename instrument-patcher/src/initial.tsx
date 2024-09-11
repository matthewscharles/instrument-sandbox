import { Node, Edge } from 'reactflow'

export const initialNodes : Node[] = [
  {
    id: '1',
    type: 'oscillator',
    position: { x: 250, y: 0 },
    data: { label: "oscillator", frequency: 440 },
  },
  // you can also pass a React component as a label
  {
    id: '2',
    type: 'output',
    data: { label: <div>output</div> },
    position: { x: 250, y: 150 },
  },
  {
    id: '3',
    type: 'filter',
    data: { label: <div>filter</div> },
    position: { x: 300, y: 200 },
  },
  // { id: 'e1-2', source: '1', target: '2', animated: true },
]

export const initialEdges : Edge[] = [
  // { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-2', source: '1', target: '2', animated: false },
]