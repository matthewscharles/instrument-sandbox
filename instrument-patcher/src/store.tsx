//* react-flow */
import {
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
} from "reactflow";
import { createWithEqualityFn } from "zustand/traditional";
import { initialNodes, initialEdges } from "./initial";

//* custom nodes */
import { NoiseNode } from "./audio_nodes/NoiseNode.tsx";
import { DustNode } from "./audio_nodes/DustNode.tsx";
import { EchoNode } from "./audio_nodes/EchoNode.tsx";
import { ConstantNode } from "./audio_nodes/ConstantNode.tsx";
import { CustomOscillatorNode } from "./audio_nodes/OscillatorNode.tsx";
import { CustomAudioNode } from "./audio_nodes/CustomAudioNode.ts";
import { CustomFilterNode } from "./audio_nodes/CustomFilterNode.tsx";
import { CustomGainNode } from "./audio_nodes/CustomGainNode.tsx";

export interface StoreState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addEdge: (data: Omit<Edge, "id">) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  deleteEdge: (data: Edge[]) => void;
  deleteNode: (data: Node[]) => void;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
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

  init() {},

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });

    get().nodes.forEach((value) => {
      let obj;

      const context = (window as any).context;

      if (!(value.id in (window as any).patch)) {
        if (value.type === "oscillator") {
          obj = new CustomOscillatorNode(context, {
            frequency: value.data.frequency,
          });
        }

        if (value.type === "noise") {
          obj = new NoiseNode(context);
        }

        if (value.type === "dust") {
          obj = new DustNode(context);
        }

        if (value.type === "filter") {
          obj = new CustomFilterNode(context, {
            frequency: value.data.frequency,
          });
        }

        if (value.type === "delay") {
          obj = new EchoNode((window as any).context, {
            delayTime: value.data.delay,
            feedback: 0,
          });
        }

        if (value.type === "constant") {
          obj = new ConstantNode(context, value.data.value);
        }

        if (value.type === "gain") {
          obj = new CustomGainNode(context, { gain: value.data.gain });
        }

        if (value.type === "output") {
          obj = context.destination;
        }

        (window as any).patch[value.id] = obj;
      }
    });

    get().edges.forEach((value) => {
      // (window as any).patch[value.source][value.sourceHandle].connect((window as any).patch[value.target][value.targetHandle]);
      // (window as any).connections[value.id] = value;
    });
  },

  onConnect(params) {
    const { source, sourceHandle, target, targetHandle } = params;
    const key = `e_${source}-${sourceHandle}_${target}-${targetHandle}`;

    const newConnection: Connection = {
      source,
      target,
      sourceHandle,
      targetHandle,
    };

    set({
      edges: addEdge(params, get().edges),
      connections: { ...get().connections, [key]: newConnection },
    });

    // Connect the nodes in the audio context
    const patch = (window as any).patch;
    if (patch[source] && patch[target]) {
      patch[source][sourceHandle].connect(patch[target][targetHandle]);
    }
  },
  
  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });

    // get().edges.forEach((value) => {
    //   (window as any).patch[value.source][value.sourceHandle].connect(
    //     (window as any).patch[value.target][value.targetHandle]
    //   );
    // });
  },

  addEdge(data) {
    const id = (get().edges.length + 1).toString();
    const edge = { id, ...data };
    set({ edges: [edge, ...get().edges] });

    get().edges.forEach((value) => {
      // console.log('~~~edgesChange', value, value.sourceHandle, value.targetHandle);
      // console.log('~~~patch', (window as any).patch[value.source], (window as any).patch[value.target]);
      // console.log('~~~patch[value.source]', (window as any).patch[value.source]);
      // console.log('value.source', value.source, 'value.sourceHandle',value.sourceHandle);
      // console.log('patch[value.source][value.sourceHandle]',(window as any).patch[value.source][value.sourceHandle]);
      // console.log('instance of AudioNode', (window as any).patch[value.target][value.targetHandle] instanceof AudioNode);
      // const source = (window as any).patch[value.source];
      const [source, target] = [
        (window as any).patch[value.source],
        (window as any).patch[value.target],
      ];
      if (source instanceof CustomAudioNode) {
        // console.log('custom node');

        if (target instanceof AudioDestinationNode) {
          console.log("destination is AudioDestinationNode", target);
          source.connect(target);
        } else {
          source.connect(target[value.targetHandle]);
        }
      } else {
        source[value.sourceHandle].connect(target[value.targetHandle]);
      }
      const key = `e_${value.source}-${value.sourceHandle}_${value.target}-${value.targetHandle}`;
      (window as any).connections[id] = { ...value, id: key };
      console.log("connections", (window as any).connections);
    });
  },

  deleteEdge(data) {
    if (Array.isArray(data) && data.length > 0) {
      const id = data[0].id;
      console.log("deleteEdge", id, data);

      const patcher = (window as any).patch;
      const connections = (window as any).connections;

      if (connections && connections[id]) {
        const sourceId = connections[id].source;
        const targetId = connections[id].target;
        const sourceHandle = connections[id].sourceHandle;
        const targetHandle = connections[id].targetHandle;

        if (patcher[sourceId] && patcher[targetId]) {
          const sourceNode = patcher[sourceId];
          const targetNode = patcher[targetId];

          console.log("delete", sourceNode, targetNode);

          if (
            sourceNode instanceof CustomAudioNode ||
            sourceNode instanceof ConstantNode ||
            sourceNode instanceof NoiseNode ||
            sourceNode instanceof EchoNode ||
            sourceNode instanceof DustNode
          ) {
            if (targetNode instanceof AudioDestinationNode) {
              console.log("destination is AudioDestinationNode", targetNode);
              sourceNode.disconnect(targetNode);
            } else {
              sourceNode.disconnect(targetNode[targetHandle]);
            }
          } else {
            sourceNode[sourceHandle].disconnect(targetNode[targetHandle]);
          }
        } else {
          console.error(
            "Source or target node not found in patcher",
            sourceId,
            targetId
          );
        }
        console.log("delete connection", connections[id]);
        if(id in connections){
          delete connections[id];
        } else {
          console.error("Connection not found for id", id);
        }
        // connections = connections.filter(conn => conn.id !== id);
      } else {
        console.error("Connection not found for id", id);
      }

      set({
        edges: get().edges.filter((edge) => edge.id !== id),
      });
    } else {
      console.error("Invalid data provided to deleteEdge", data);
    }
  },

  addNode(type, position) {
    const id = (get().nodes.length + 1).toString();
    const defaults: { [key: string]: any } = {
      oscillator: { frequency: 440, label: "oscillator" },
      filter: { frequency: 100, label: "filter" },
      gain: { gain: 0, label: "gain" },
      delay: { delay: 10, label: "delay" },
      output: { label: "output" },
      constant: { value: 0, label: "constant" },
      noise: { label: "noise" },
      dust: { label: "dust" },
    };

    const newNode: CustomNode = {
      id,
      type,
      position,
      data: defaults[type],
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  deleteNode(data) {
    console.log("deleteNode", data);
    if (Array.isArray(data) && data.length > 0) {
      let id = data[0].id;
      console.log("deleteNode", id, data);
      let patcher = (window as any).patch;
      console.log("delete", patcher[id]);
      //** don't dispose just yet, since we may need to undo */
      // patcher[id].dispose();
      delete patcher[id];
    }
  },
}));
