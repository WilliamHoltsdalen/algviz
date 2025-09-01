import { Graph, GraphNode, GraphEdge } from '@/types/graph';

export function generateSampleGraph(): Graph {
  const nodes: GraphNode[] = [
    { id: 'A', x: 100, y: 100, label: 'A', isStart: true },
    { id: 'B', x: 250, y: 80, label: 'B' },
    { id: 'C', x: 400, y: 100, label: 'C' },
    { id: 'D', x: 100, y: 200, label: 'D' },
    { id: 'E', x: 250, y: 200, label: 'E' },
    { id: 'F', x: 400, y: 200, label: 'F' },
    { id: 'G', x: 250, y: 300, label: 'G', isEnd: true },
  ];

  const edges: GraphEdge[] = [
    { id: 'AB', from: 'A', to: 'B', weight: 4 },
    { id: 'AC', from: 'A', to: 'C', weight: 2 },
    { id: 'AD', from: 'A', to: 'D', weight: 7 },
    { id: 'BC', from: 'B', to: 'C', weight: 1 },
    { id: 'BD', from: 'B', to: 'D', weight: 3 },
    { id: 'BE', from: 'B', to: 'E', weight: 5 },
    { id: 'CE', from: 'C', to: 'E', weight: 8 },
    { id: 'CF', from: 'C', to: 'F', weight: 3 },
    { id: 'DE', from: 'D', to: 'E', weight: 2 },
    { id: 'DF', from: 'D', to: 'F', weight: 6 },
    { id: 'EG', from: 'E', to: 'G', weight: 4 },
    { id: 'FG', from: 'F', to: 'G', weight: 2 },
  ];

  return { nodes, edges };
}

export function generateRandomGraph(nodeCount: number = 8): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // Generate nodes in a circular pattern
  const centerX = 250;
  const centerY = 200;
  const radius = 120;
  
  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    nodes.push({
      id: String.fromCharCode(65 + i), // A, B, C, etc.
      x,
      y,
      label: String.fromCharCode(65 + i),
      isStart: i === 0,
      isEnd: i === nodeCount - 1,
    });
  }
  
  // Generate edges randomly
  let edgeId = 0;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // 40% chance of having an edge between any two nodes
      if (Math.random() < 0.4) {
        const weight = Math.floor(Math.random() * 10) + 1;
        edges.push({
          id: `edge-${edgeId++}`,
          from: nodes[i].id,
          to: nodes[j].id,
          weight,
        });
      }
    }
  }
  
  // Ensure the graph is connected by adding some guaranteed edges
  for (let i = 0; i < nodes.length - 1; i++) {
    const existingEdge = edges.find(e => 
      (e.from === nodes[i].id && e.to === nodes[i + 1].id) ||
      (e.from === nodes[i + 1].id && e.to === nodes[i].id)
    );
    
    if (!existingEdge) {
      const weight = Math.floor(Math.random() * 10) + 1;
      edges.push({
        id: `edge-${edgeId++}`,
        from: nodes[i].id,
        to: nodes[i + 1].id,
        weight,
      });
    }
  }
  
  return { nodes, edges };
}
