import { applyNodeChanges, applyEdgeChanges, Node, Edge, NodeChange, EdgeChange } from 'reactflow';
import { createWithEqualityFn } from 'zustand/traditional';
import {initialNodes, initialEdges} from './initial';


export interface StoreState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    addEdge: (data: Omit<Edge, 'id'>) => void;
}

export const useStore = createWithEqualityFn<StoreState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    
    onNodesChange(changes) {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    
    onEdgesChange(changes) {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    
    addEdge(data) {
        const id = (get().edges.length + 1).toString();
        const edge = { id, ...data };
    
        set({ edges: [edge, ...get().edges] });
    },
})
);