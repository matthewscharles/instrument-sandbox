import ReactFlow, { Node, Edge, Controls, Background, MiniMap, useNodesState, useEdgesState, Connection, addEdge } from 'reactflow';
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
  // const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode[]>(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  
  // const createNode = useCallback((type: string, position: { x: number, y: number }) => {
  //   const newNode: CustomNode = {
  //     id: `${nodes.length + 1}`,
  //     type,
  //     position,
  //     data: { frequency: 440, label: type } // Default data, can be customized
  //   };
  //   setNodes((prevNodes) => [...prevNodes, newNode]);
  // }, [nodes, setNodes]);
  
  // (window as any).createNode = createNode;
  
  const onConnect = useCallback((connection:Connection) => {
      const edge = {...connection, animated: false, id:`${edges.length + 1}`};
      setEdges((prevEdges)=>addEdge(edge, prevEdges));
      (window as any).getState();
    },
    []
  );
  
  (window as any).patch = {};

  (window as any).getState = function(){
    console.log({nodes, edges});
    nodes.forEach((value)=>{
      console.log(value.type, value.id);
      let obj;
      if(!(value.id in (window as any).patch)){  
        if(value.type === "oscillator"){
          obj = new Tone.Oscillator(value.data.frequency, "sawtooth");
          obj.start();
          obj.volume.value = -20;
        }
        
        if(value.type === "filter"){
          obj = new Tone.Filter(value.data.frequency, "lowpass");
        }
        if(value.type === "output"){
          obj = Tone.Destination;
        }
        
        (window as any).patch[value.id] = obj;
      }
    })
    edges.forEach((value)=>{
      console.log(value.source, value.target);
      (window as any).patch[value.source].connect((window as any).patch[value.target]);
      // disconnections ? compare with a saved state
    })
    Tone.start();
  }
  
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
        onConnect = {onConnect}
        nodeTypes = {nodeTypes}
      >
        <Controls />
        <Background />
        {/* <MiniMap /> */}
      </ReactFlow>
    </Box>
  );
}

export default App;