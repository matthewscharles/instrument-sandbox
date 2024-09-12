import { applyNodeChanges, applyEdgeChanges, Node, Edge, NodeChange, EdgeChange } from 'reactflow';
import { createWithEqualityFn } from 'zustand/traditional';
import {initialNodes, initialEdges} from './initial';
import * as Tone from 'tone';

export interface StoreState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    addEdge: (data: Omit<Edge, 'id'>) => void;
    addNode: (type: string, position: { x: number, y: number }) => void;
}

interface CustomNodeData {
    frequency: number;
    label: string;
}
  
  interface CustomNode extends Node {
    data: CustomNodeData;
}

(window as any).patch =(window as any).patch || {};
(window as any).connections = (window as any).connections || {};

export const useStore = createWithEqualityFn<StoreState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    
    init(){
        
    },
    
    onNodesChange(changes) {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
        
        get().nodes.forEach((value)=>{
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
        });
        get().edges.forEach((value)=>{
            // console.log(value.source, value.target);
            (window as any).patch[value.source].connect((window as any).patch[value.target]);
            // disconnections ? compare with a saved state
          });
          
        Tone.start();
    },
    
    onEdgesChange(changes) {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
        get().edges.forEach((value)=>{
            // console.log(value.source, value.target);
            // console.log('edgesChange', value);
            (window as any).patch[value.source].connect((window as any).patch[value.target]);
            // disconnections ? compare with a saved state
          });
          Tone.start();
    },
    
    addEdge(data) {
        const id = (get().edges.length + 1).toString();
        const edge = { id, ...data };
        set({ edges: [edge, ...get().edges] });
        get().edges.forEach((value)=>{
            // console.log(value.source, value.target);
            // console.log('edgesChange', value);
            (window as any).patch[value.source].connect((window as any).patch[value.target]);
            // disconnections ? compare with a saved state
          });
        Tone.start();
    },
    
    addNode(type, position) {
        const id = (get().nodes.length + 1).toString();
        const newNode: CustomNode = {
            id,
            type,
            position,
            data: { frequency: 440, label: type }
        };
        set({ nodes: [...get().nodes, newNode] });
        // setNodes((prevNodes) => [...prevNodes, newNode]);
      }
})
);