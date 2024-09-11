import { Node, Edge } from 'reactflow'

export const initialNodes : Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: <div>oscillator</div> },
    position: { x: 250, y: 25 },
  },
  // you can also pass a React component as a label
  {
    id: '2',
    type: 'output',
    data: { label: <div>output</div> },
    position: { x: 250, y: 100 },
  },
  // { id: 'e1-2', source: '1', target: '2', animated: true },
]

export const initialEdges : Edge[] = [
  // { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-2', source: '1', target: '2', animated: false },
]