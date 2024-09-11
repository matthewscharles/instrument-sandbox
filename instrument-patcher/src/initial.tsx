import { Node, Edge } from 'reactflow'

export const initialNodes : Node[] = [
  {
    id: '1',
    type: 'oscillator',
    position: { x: 250, y: 0 },
    data: { label: "oscillator", frequency: 220 },
  },
  // you can also pass a React component as a label
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
    // { id: 'e1-2', source: '1', target: '2', animated: true },
]

export const initialEdges : Edge[] = [
  // { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: false },
  { id: 'e3-2', source: '3', target: '2', animated: false },
]