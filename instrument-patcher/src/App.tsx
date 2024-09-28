import ReactFlow, { Node, Edge, Controls, Background, BackgroundVariant, MiniMap, useNodesState, useEdgesState, Connection, addEdge, ReactFlowInstance } from 'reactflow';
import { useCallback, useState } from 'react';
import "reactflow/dist/style.css";
import { Box, Button, VStack } from "@chakra-ui/react";
import { OscillatorInit } from './components/oscillator';
import { FilterInit } from './components/filter';
import { GainInit } from './components/gain';
import { OutputInit } from './components/output';
import { DelayInit } from './nodes/delayInit';
import { ConstantNode } from './nodes/constantNode';
import { NoiseNode } from './nodes/noiseInit';
import { DustNode } from './nodes/dustInit';

import { useStore, StoreState } from './store';
import { shallow } from 'zustand/shallow';

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
  constant: ConstantNode, 
  noise: NoiseNode,
  dust: DustNode
}

const App = ()=> {
  const store = useStore(selector, shallow);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
  
  const handlePaneClick = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX -200, y: clientY -200 });
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
  }, []);
  
  const addNode = useCallback((type: string) => {
    if (!rfInstance) return;
    const position = rfInstance.project(mousePosition || { x: 400, y: 400 }) ;
    store.addNode(type, position);
  }, [rfInstance, mousePosition, store]);
  
  const dbl = function(){
    console.log("double click");
  }
  
  return (

    <Box height="600px" width="600px" border="1px solid black" backgroundColor="white" className="patcher">
    <VStack spacing={4} align="stretch" position="absolute" top="10px" right="10px" zIndex="10">
        <Button onClick={() => addNode('oscillator')}>oscillator</Button>
        <Button onClick={() => addNode('filter')}>filter</Button>
        <Button onClick={() => addNode('gain')}>gain</Button>
        <Button onClick={() => addNode('delay')}>delay</Button>
        <Button onClick={() => addNode('noise')}>noise</Button>
        <Button onClick={() => addNode('dust')}>dust</Button>
        <Button onClick={() => addNode('constant')}>constant</Button>
        <Button onClick={() => addNode('output')}>output</Button>
      </VStack>
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