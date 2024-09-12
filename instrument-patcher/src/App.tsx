import ReactFlow, { Node, Edge, Controls, Background, MiniMap, useNodesState, useEdgesState, Connection, addEdge, ReactFlowInstance } from 'reactflow';
import { useCallback, useState } from 'react';
import "reactflow/dist/style.css";
import { Box } from "@chakra-ui/react";
import { initialNodes, initialEdges } from './initial';
import { OscillatorInit } from './components/oscillator';
import { FilterInit } from './components/filter';
import * as Tone from 'tone';
import { useStore, StoreState } from './store';
import { shallow } from 'zustand/shallow';
(window as any).Tone = Tone;

const selector = (store: StoreState) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
  addNode: store.addNode
})

const proOptions : {hideAttribution: boolean} = {hideAttribution: true};

// Define custom node type
interface CustomNodeData {
  frequency: number;
  label: string;
}

interface CustomNode extends Node {
  data: CustomNodeData;
}

const nodeTypes = {
  oscillator: OscillatorInit,
  filter: FilterInit
  // output: OutputInit,
}




const App = ()=> {
  const store = useStore(selector, shallow);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  
  const handlePaneClick = useCallback((event: MouseEvent<Element,MouseEvent>) => {
    if (!rfInstance) return;
    const { clientX, clientY } = event;
    const position = rfInstance.project({ x: clientX, y: clientY });
    store.addNode('oscillator', position); // Add a new node of type 'oscillator' at the clicked position
  }, [rfInstance, store]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
  }, []);
  
  return (
    <Box height="500px" width="500px" border="1px solid black" backgroundColor="white">
      <ReactFlow 
        nodes={store.nodes} 
        edges={store.edges} 
        fitView 
        nodesDraggable 
        // proOptions={proOptions} 
        onNodesChange={store.onNodesChange} 
        onEdgesChange={store.onEdgesChange}
        onConnect = {store.addEdge}
        nodeTypes = {nodeTypes}
        onPaneClick = {handlePaneClick}
        onInit = {onInit}
      >
        <Controls />
        <Background />
        {/* <MiniMap /> */}
      </ReactFlow>
    </Box>
  );
}

export default App;