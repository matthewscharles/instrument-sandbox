// App.tsx
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  ReactFlowInstance,
} from 'reactflow';
import { useCallback, useState, useRef } from 'react';
import 'reactflow/dist/style.css';
import { Box, Button, VStack } from '@chakra-ui/react';
import { useStore, StoreState } from './store';
import { shallow } from 'zustand/shallow';

import { OscillatorInit } from './components/oscillator';
import { FilterInit } from './components/filter';
import { GainInit } from './components/gain';
import { OutputInit } from './components/output';
import { DelayInit } from './nodes/delayInit';
import { SampleHoldInit } from './nodes/sampleHoldInit';
import { ConstantNode } from './nodes/constantNode';
import { NoiseNode } from './nodes/noiseInit';
import { DustNode } from './nodes/dustInit';
import { SlewRateInit } from './nodes/slewRateInit';
import { MidiCCNode } from './nodes/midiCC';
import { PulseInit } from './components/pulse';

const selector = (store: StoreState) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.deleteEdge,
  addEdge: store.addEdge,
  addNode: store.addNode,
  deleteNode: store.deleteNode,
});

const proOptions: { hideAttribution: boolean } = { hideAttribution: true };

const nodeTypes = {
  oscillator: OscillatorInit,
  filter: FilterInit,
  gain: GainInit,
  delay: DelayInit,
  output: OutputInit,
  constant: ConstantNode,
  noise: NoiseNode,
  dust: DustNode,
  sampleandhold: SampleHoldInit,
  slewrate: SlewRateInit,
  midiCC: MidiCCNode,
  pulse: PulseInit,
};

// Define an array of node types for dynamic rendering
const nodeTypesList = [
  { type: 'oscillator', label: 'Oscillator' },
  { type: 'filter', label: 'Filter' },
  { type: 'gain', label: 'Gain' },
  { type: 'delay', label: 'Delay' },
  { type: 'noise', label: 'Noise' },
  { type: 'dust', label: 'Dust' },
  { type: 'constant', label: 'Constant' },
  { type: 'sampleandhold', label: 'Sample and Hold' },
  { type: 'slewrate', label: 'Slew Rate' },
  { type: 'output', label: 'Output' },
  { type: 'midiCC', label: 'MIDI CC' },
  { type: 'pulse', label: 'Pulse' },
];

const App = () => {
  const store = useStore(selector, shallow);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePaneClick = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
  }, []);

  const addNode = useCallback(
    (type: string) => {
      if (!rfInstance) return;
      const position = rfInstance.project(mousePosition || { x: 1000, y: 1000 });
      store.addNode(type, position);
    },
    [rfInstance, mousePosition, store]
  );

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = rfInstance?.project({
        x: event.clientX - (reactFlowBounds?.left || 0),
        y: event.clientY - (reactFlowBounds?.top || 0),
      });
      
      if (position) {
        store.addNode(type, position);
      }
    },
    [rfInstance, store]
  );

  const dbl = function () {
    // console.log('double click');
  };

  return (
    <Box height="600px" width="600px" border="1px solid black" backgroundColor="white" className="patcher">
      <VStack spacing={4} align="stretch" position="absolute" top="10px" right="10px" zIndex="10">
        <Button className="menu__collapse" onClick={toggleExpand}>
          {isExpanded ? '-' : '+'}
        </Button>
        {isExpanded &&
          nodeTypesList.map((node) => (
            <Button
              key={node.type}
              onClick={() => addNode(node.type)}
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
              className="obj__small"
            >
              {node.label}
            </Button>
          ))}
      </VStack>
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={store.nodes}
          edges={store.edges}
          fitView
          nodesDraggable
          proOptions={proOptions}
          onNodesChange={store.onNodesChange}
          onEdgesChange={store.onEdgesChange}
          onNodesDelete={store.deleteNode}
          onNodeDoubleClick={dbl}
          onEdgesDelete={store.onEdgesDelete}
          onConnect={store.addEdge}
          nodeTypes={nodeTypes}
          onPaneClick={handlePaneClick}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Controls />
          <Background variant={BackgroundVariant.Lines} />
        </ReactFlow>
      </div>
    </Box>
  );
};

export default App;