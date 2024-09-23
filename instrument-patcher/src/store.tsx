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
    deleteEdge: (data: Edge[]) => void;
    deleteNode: (data: Node[]) => void;
}

interface CustomNodeData {
    frequency: number;
    label: string;
}
  
  interface CustomNode extends Node {
    data: CustomNodeData;
}

///* put the patch and connections in the global scope for debugging purposes */

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
            let obj;
            
            if(!(value.id in (window as any).patch)){  
                
              if(value.type === "oscillator"){
                obj = new Tone.Oscillator(value.data.frequency, "sawtooth");
                obj.start();
                // obj.volume.value = -20;
              }
              
              if(value.type === "filter"){
                obj = new Tone.Filter(value.data.frequency, "lowpass");
              }
              
              if(value.type ==="delay"){
                obj = new Tone.FeedbackDelay(value.data.delay, 0.5);
              }
              
              if(value.type === "gain"){
                obj = new Tone.Volume(value.data.gain);
              }
              
              if(value.type === "output"){
                obj = Tone.Destination;
              }
              
              (window as any).patch[value.id] = obj;
            }
        });
        
        get().edges.forEach((value)=>{
            (window as any).patch[value.source][value.sourceHandle].connect((window as any).patch[value.target][value.targetHandle]);
            (window as any).connections[value.id] = value;
            // disconnections ? compare with a saved state
          });
          
        Tone.start();
    },
    
    onEdgesChange(changes) {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
        
        get().edges.forEach((value)=>{
            (window as any).patch[value.source][value.sourceHandle].connect((window as any).patch[value.target][value.targetHandle]);
          });
          Tone.start();
    },
    
    addEdge(data) {
        const id = (get().edges.length + 1).toString();
        const edge = { id, ...data };
        set({ edges: [edge, ...get().edges] });
        
        get().edges.forEach((value)=>{
            console.log('~~~edgesChange', value, value.sourceHandle, value.targetHandle);
            console.log('~~~patch', (window as any).patch[value.source], (window as any).patch[value.target]);
            (window as any).patch[value.source][value.sourceHandle].connect((window as any).patch[value.target][value.targetHandle]);
          });
        Tone.start();
    },
    
    deleteEdge(data) {
        if(Array.isArray(data) && data.length > 0){
            let id = data[0].id;
            console.log('deleteEdge', id, data);
            let patcher = (window as any).patch;
            console.log('delete', patcher[(window as any).connections[id].source], patcher[(window as any).connections[id].target]);    
            patcher[(window as any).connections[id].source].disconnect(patcher[(window as any).connections[id].target]);
        } else {
            console.error('data is not an array or is empty');
        }
        
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
    },
    
    deleteNode(data) {
        console.log('deleteNode', data);
        if(Array.isArray(data) && data.length > 0){
            let id = data[0].id;
            console.log('deleteNode', id, data);
            let patcher = (window as any).patch;
            console.log('delete', patcher[id]);    
            patcher[id].dispose();
            delete patcher[id];
        }
        
    }
})
);