import ReactFlow, { Node, Edge } from 'reactflow';
import "reactflow/dist/style.css";
import { Box } from "@chakra-ui/react";

const nodes : Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 25 },
  },
  // you can also pass a React component as a label
  {
    id: '2',
    type: 'output',
    data: { label: <div>output node</div> },
    position: { x: 250, y: 100 },
  },
  // { id: 'e1-2', source: '1', target: '2', animated: true },
]

const edges : Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
]

function App() {
  return (
    <Box height="500px" width="500px" border="1px solid black" backgroundColor="white">
      <ReactFlow nodes={nodes} edges={edges} />
    </Box>
  );
}



export default App