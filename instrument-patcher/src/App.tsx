import ReactFlow, { Node, Edge, Controls, Background, BackgroundVariant, MiniMap, useNodesState, useEdgesState, Connection, addEdge, ReactFlowInstance } from 'reactflow';
import { useCallback, useState } from 'react';
import "reactflow/dist/style.css";
import { Box } from "@chakra-ui/react";
import { OscillatorInit } from './components/oscillator';
import { FilterInit } from './components/filter';
import { GainInit } from './components/gain';
import { OutputInit } from './components/output';
import { DelayInit } from './nodes/delayInit';
import { useStore, StoreState } from './store';
import { shallow } from 'zustand/shallow';

import * as Tone from 'tone';
(window as any).Tone = Tone;

const selector = (store: StoreState) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.deleteEdge,
  addEdge: store.addEdge,
  addNode: store.addNode,
  deleteNode: store.deleteNode
})

const proOptions : {hideAttribution: boolean} = {hideAttribution: true};

interface CustomNodeData {
  frequency: number;
  label: string;
}

interface CustomNode extends Node {
  data: CustomNodeData;
}

const nodeTypes = {
  oscillator: OscillatorInit,
  filter: FilterInit,
  gain: GainInit,
  delay: DelayInit,
  output: OutputInit,
}

const App = ()=> {
  const store = useStore(selector, shallow);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  
  const handlePaneClick = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {
    
    if (!rfInstance) return;
    const { clientX, clientY } = event;
    const position = rfInstance.project({ x: clientX, y: clientY });
    store.addNode('oscillator', position); // Add a new node of type 'oscillator' at the clicked position
 
  }, [rfInstance, store]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
  }, []);
  
  const dbl = function(){
    console.log("double click");
  }
  
  return (
    <Box height="800px" width="800px" border="1px solid black" backgroundColor="white" className="patcher">
      <ReactFlow 
        nodes={store.nodes} 
        edges={store.edges} 
        fitView 
        nodesDraggable 
        // proOptions={proOptions} 
        onNodesChange={store.onNodesChange} 
        onEdgesChange={store.onEdgesChange}
        onNodesDelete={store.deleteNode}
        onNodeDoubleClick={dbl}
        onEdgesDelete={store.onEdgesDelete}
        onConnect = {store.addEdge}
        
        nodeTypes = {nodeTypes}
        onPaneClick = {handlePaneClick}
        onInit = {onInit}
      >
        <Controls />
        {/* <Background color="#ccc" /> */}
        <Background variant={BackgroundVariant.Lines} />
        {/* <MiniMap /> */}
      </ReactFlow>
    </Box>
  );
}

export default App;