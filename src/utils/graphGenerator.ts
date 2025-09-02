import { Graph, GraphNode, GraphEdge } from '@/types/graph';



export function generateRandomGraph(nodeCount: number = 8): Graph {
  // Ensure minimum node count for meaningful graphs
  if (nodeCount < 3) {
    nodeCount = 3;
  }
  
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // Adjust layout based on node count
  let centerX, centerY, radius;
  
  if (nodeCount <= 4) {
    // For very small graphs (3-4 nodes), use a compact layout
    centerX = 250;
    centerY = 200;
    radius = 60;
  } else if (nodeCount <= 6) {
    // For small graphs (5-6 nodes), use a compact layout
    centerX = 250;
    centerY = 200;
    radius = 80;
  } else if (nodeCount <= 8) {
    // For medium graphs, use standard circular layout
    centerX = 250;
    centerY = 200;
    radius = 120;
  } else {
    // For larger graphs, use expanded layout
    centerX = 250;
    centerY = 200;
    radius = 150;
  }
  
  // Generate nodes in a circular pattern
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
  
  // Generate edges randomly with adjusted probability based on graph size
  let edgeId = 0;
  const edgeProbability = nodeCount <= 4 ? 0.8 : nodeCount <= 6 ? 0.6 : nodeCount <= 8 ? 0.4 : 0.3;
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Higher chance of edges for smaller graphs to ensure connectivity
      if (Math.random() < edgeProbability) {
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
  
  // Ensure the graph is connected by adding guaranteed edges
  // For very small graphs, ensure more connectivity
  const minEdges = nodeCount <= 4 ? nodeCount + 1 : nodeCount <= 6 ? nodeCount : nodeCount - 1;
  
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
  
  // For very small graphs, add some cross-connections to ensure good connectivity
  if (nodeCount <= 6 && edges.length < minEdges + 2) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 2; j < nodes.length; j++) {
        if (edges.length >= minEdges + 2) break;
        
        const existingEdge = edges.find(e => 
          (e.from === nodes[i].id && e.to === nodes[j].id) ||
          (e.from === nodes[j].id && e.to === nodes[i].id)
        );
        
        if (!existingEdge) {
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
  }
  
  return { nodes, edges };
}
