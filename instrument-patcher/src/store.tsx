//* react-flow */
import { applyNodeChanges, applyEdgeChanges, Node, Edge, NodeChange, EdgeChange } from 'reactflow';
import { createWithEqualityFn } from 'zustand/traditional';
import {initialNodes, initialEdges} from './initial';

//* tone  */
import * as Tone from 'tone';

//* custom nodes */
import { NoiseNode } from './audio_nodes/NoiseNode.tsx';
import { DustNode } from './audio_nodes/DustNode.tsx';
import { EchoNode } from './audio_nodes/EchoNode.tsx';

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
    data: object;
}
  
  interface CustomNode extends Node {
    data: CustomNodeData;
}

///* patch and connections in the global scope for debugging purposes */
(window as any).context = new AudioContext();
(window as any).patch = (window as any).patch || {};
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
            
            const context = (window as any).context;
            
            if(!(value.id in (window as any).patch)){  
                
              if(value.type === "oscillator"){
                obj = new Tone.Oscillator(value.data.frequency, "sawtooth");
                obj.start();
              }
              
              if(value.type === "noise"){
                obj = new NoiseNode(context);
              }
              
              if(value.type === "dust"){
                obj = new DustNode(context);
              }
              
              if(value.type === "filter"){
                obj = new Tone.Filter(value.data.frequency, "lowpass");
              }
              
              if(value.type ==="delay"){
                obj = new EchoNode((window as any).context, {delayTime: value.data.delay, feedback: 0.5});
              }
              
              if(value.type ==="constant"){
                // obj = new Tone.Signal(value.data.value);
              }
              
              if(value.type === "gain"){
                obj = new Tone.Volume(value.data.gain);
              }
              
              if(value.type === "output"){
                // obj = Tone.Destination;
                obj = context.destination;
              }
              
              (window as any).patch[value.id] = obj;
            }
        });
        
        get().edges.forEach((value)=>{
            (window as any).patch[value.source][value.sourceHandle].connect((window as any).patch[value.target][value.targetHandle]);
            (window as any).connections[value.id] = value;
          });
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
            // console.log('~~~edgesChange', value, value.sourceHandle, value.targetHandle);
            // console.log('~~~patch', (window as any).patch[value.source], (window as any).patch[value.target]);
            // console.log('~~~patch[value.source]', (window as any).patch[value.source]);
            // console.log('value.source', value.source, 'value.sourceHandle',value.sourceHandle);
            // console.log('patch[value.source][value.sourceHandle]',(window as any).patch[value.source][value.sourceHandle]);
            // console.log('instance of AudioNode', (window as any).patch[value.target][value.targetHandle] instanceof AudioNode);
            // const source = (window as any).patch[value.source];
            const [source, target] = [(window as any).patch[value.source], (window as any).patch[value.target]];
            if(source instanceof NoiseNode || source instanceof EchoNode){
              console.log('custom node');
              
              if(target instanceof AudioDestinationNode){
                console.log('destination is AudioDestinationNode', target);
                source.connect(target);
              } else {
                source.connect(target[value.targetHandle]);
              }
            } else {
              source[value.sourceHandle].connect(target[value.targetHandle]);
            }
          });
        Tone.start();
    },
    
    deleteEdge(data) {
        if(Array.isArray(data) && data.length > 0){
            let id = data[0].id;
            // console.log('deleteEdge', id, data);
            let patcher = (window as any).patch;
            // console.log('delete', patcher[(window as any).connections[id].source], patcher[(window as any).connections[id].target]);    
            patcher[(window as any).connections[id].source].disconnect(patcher[(window as any).connections[id].target]);
        } else {
            console.error('data is not an array or is empty');
        }
        
    },
    
    addNode(type, position) {
        const id = (get().nodes.length + 1).toString();
        const defaults: {[key: string]: any} = {
            oscillator: { frequency: 440, label: 'oscillator' },
            filter: { frequency: 100, label: 'filter' },
            gain: { gain: 0, label: 'gain' },
            delay: { delay: 10, label: 'delay' },
            output: { label: 'output' },
            constant: { value: 0, label: 'constant' },
            noise: { label: 'noise' },
            dust: { label: 'dust' }
        };
        
        
        
        const newNode: CustomNode = {
            id,
            type,
            position,
            data: defaults[type]
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