import ReactFlow, { Node, Edge, Controls, Background, MiniMap, useNodesState, useEdgesState, Connection, addEdge, } from 'reactflow';
import { useCallback } from 'react';
import "reactflow/dist/style.css";
import { Box } from "@chakra-ui/react";
import { initialNodes, initialEdges } from './initial';

const proOptions : {hideAttribution: boolean} = {hideAttribution: true}

const App = ()=> {
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  
  const onConnect = useCallback((connection:Connection) => {
    const edge = {...connection, animated: false, id:`${edges.length + 1}`};
    setEdges((prevEdges)=>addEdge(edge, prevEdges));
  },[])
  
  return (
    <Box height="500px" width="500px" border="1px solid black" backgroundColor="white">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView 
        nodesDraggable 
        proOptions={proOptions} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        onConnect = {onConnect}
      >
        <Controls />
        <Background />
        {/* <MiniMap /> */}
      </ReactFlow>
    </Box>
  );
}

export default App