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
import { SampleHoldNode } from "./audio_nodes/SampleHoldNode.tsx";
import { SlewRateNode } from "./audio_nodes/SlewRateNode.tsx";
import { MidiControlChangeNode } from "./audio_nodes/MidiControlChangeNode.tsx";
import { PulseNode } from "./audio_nodes/PulseNode.tsx";
import { EventReceiverNode } from "./audio_nodes/EventReceiverNode.ts";

export interface StoreState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
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
window.context = new AudioContext();
window.patch = window.patch || {};
window.connections = window.connections || {};


//* node configuration */
const nodeConfig = {
  oscillator: {
    defaults: { frequency: 440, label: "oscillator" },
    constructor: (context: AudioContext, value: Number) =>
      new CustomOscillatorNode(context, { frequency: value.data.frequency }),
  },
  filter: {
    defaults: { frequency: 100, Q: 1, label: "filter" },
    constructor: (context: AudioContext, value: Number) =>
      new CustomFilterNode(context, { frequency: value.data.frequency }),
  },
  gain: {
    defaults: { gain: 1, label: "gain" },
    constructor: (context: AudioContext, value: Number) =>
      new CustomGainNode(context, { gain: value.data.gain }),
  },
  delay: {
    defaults: { delay: 0.5, label: "delay" },
    constructor: (context: AudioContext, value: Number) =>
      new EchoNode(context, {
        delayTime: value.data.delay,
        feedback: value.data.feedback || 0,
      }),
  },
  output: {
    defaults: { label: "output" },
    constructor: (context: AudioContext) => context.destination,
  },
  constant: {
    defaults: { value: 1, label: "constant" },
    constructor: (context: AudioContext, value: Number) => new ConstantNode(context, value.data.value),
  },
  noise: {
    defaults: { label: "noise" },
    constructor: (context: AudioContext) => new NoiseNode(context),
  },
  dust: {
    defaults: { label: "dust" },
    constructor: (context: AudioContext) => new DustNode(context),
  },
  sampleandhold: {
    defaults: { label: "sampleandhold", value: 0.01 },
    constructor: (context: AudioContext, value: Number) =>
      new SampleHoldNode(context, { value: value.data.value }),
  },
  slewrate: {
    defaults: { label: "slewrate", value: 0.01 },
    constructor: (context: AudioContext, value: Number) =>
      new SlewRateNode(context, { value: value.data.value }),
  },
  midiCC: {
    defaults: { label: "midiCC", cc: 1, value: 0 },
    constructor: (context: AudioContext, value: Number) =>
      new MidiControlChangeNode(context, {
        cc: value.data.cc,
        value: value.data.value,
      }),
  },
  pulse: {
    defaults: { frequency: 1, pulseWidth: 0.5, label: "pulse" },
    constructor: (context: AudioContext, value: Number) =>
      new PulseNode(context, value.data.frequency, value.data.pulseWidth),
  },
  event: {
    defaults: { eventName: 'defaultEvent', interval: 50, label: 'event' },
    constructor: (context: AudioContext, value: CustomNode) =>
      new EventReceiverNode(context, { eventName: value.data.eventName, interval: value.data.interval }),
  },
};

export const useStore = createWithEqualityFn<StoreState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  init() {},

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });

    const context = window.context;
    const patch = window.patch;


    get().nodes.forEach((value) => {
      if (!(value.id in patch)) {
        const constructor = nodeConfig[value.type].constructor;
        if (constructor) {
          const obj = constructor(context, value);
          patch[value.id] = obj;
        }
      }
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
    const patch = window.patch;
    if (patch[source] && patch[target]) {
      patch[source][sourceHandle].connect(patch[target][targetHandle]);
    }
  },
  
  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });

    // get().edges.forEach((value) => {
    //   window.patch[value.source][value.sourceHandle].connect(
    //     window.patch[value.target][value.targetHandle]
    //   );
    // });
  },

  addEdge(data) {
    // const id = (get().edges.length + 1).toString();
    const id = `e_${data.source}-${data.sourceHandle}_${data.target}-${data.targetHandle}`;
    const edge = { id, ...data };
    set({ edges: [edge, ...get().edges] });

    get().edges.forEach((value) => {
      const [source, target] = [
        window.patch[value.source],
        window.patch[value.target],
      ];
      if (source instanceof CustomAudioNode) {
        if (target instanceof AudioDestinationNode) {
          source.connect(target);
        } else {
          source.connect(target[value.targetHandle]);
        }
      } else {
        source[value.sourceHandle].connect(target[value.targetHandle]);
      }
      const key = `e_${value.source}-${value.sourceHandle}_${value.target}-${value.targetHandle}`;
      window.connections[id] = { ...value, id: key };
    });
  },

  deleteEdge(data) {
    if (Array.isArray(data) && data.length > 0) {
      const id = data[0].id;

      const patcher = window.patch;
      const connections = window.connections;

      if (connections && connections[id]) {
        const sourceId = connections[id].source;
        const targetId = connections[id].target;
        const sourceHandle = connections[id].sourceHandle;
        const targetHandle = connections[id].targetHandle;

        if (patcher[sourceId] && patcher[targetId]) {
          const sourceNode = patcher[sourceId];
          const targetNode = patcher[targetId];

          if (sourceNode instanceof CustomAudioNode) {
            if (targetNode instanceof AudioDestinationNode) {
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

    const newNode: CustomNode = {
      id,
      type,
      position,
      data: nodeConfig[type].defaults,
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  deleteNode(data) {
    
    if (Array.isArray(data) && data.length > 0) {
      let id = data[0].id;
      console.log("deleteNode", id, data);
      let patcher = window.patch;
      console.log("delete", patcher[id]);
      //** don't dispose just yet, since we may need to undo */
      // patcher[id].dispose();
      delete patcher[id];
    }
  },
}));
