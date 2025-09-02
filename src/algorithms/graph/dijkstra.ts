import { Graph, GraphNode, GraphEdge, DijkstraStep } from '@/types/graph';

export function dijkstraSteps(graph: Graph, startNodeId: string, endNodeId: string): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const nodes = [...graph.nodes];
  const edges = [...graph.edges];
  
  // Initialize distances
  const distances: Record<string, number> = {};
  const previous: Record<string, string> = {};
  const visited = new Set<string>();
  
  // Initialize all distances to infinity except start node
  nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
  });
  
  steps.push({
    type: 'visit',
    nodeId: startNodeId,
    message: `Starting Dijkstra's algorithm from node ${startNodeId}`,
    distances: { ...distances },
    previous: { ...previous },
  });
  
  // Create a priority queue (using array for simplicity)
  const unvisited = [...nodes];
  
  while (unvisited.length > 0) {
    // Find the unvisited node with the smallest distance
    unvisited.sort((a, b) => distances[a.id] - distances[b.id]);
    const currentNode = unvisited.shift()!;
    
    if (distances[currentNode.id] === Infinity) {
      break; // No path exists
    }
    
    visited.add(currentNode.id);
    
    steps.push({
      type: 'visit',
      nodeId: currentNode.id,
      message: `Visiting node ${currentNode.id} (distance: ${distances[currentNode.id]})`,
      distances: { ...distances },
      previous: { ...previous },
    });
    
    // Check all neighbors
    const neighbors = edges.filter(edge => 
      edge.from === currentNode.id || edge.to === currentNode.id
    );
    
    for (const edge of neighbors) {
      const neighborId = edge.from === currentNode.id ? edge.to : edge.from;
      
      if (visited.has(neighborId)) continue;
      
      const newDistance = distances[currentNode.id] + edge.weight;
      
      steps.push({
        type: 'relax',
        nodeId: neighborId,
        edgeId: edge.id,
        message: `Checking edge to ${neighborId} (weight: ${edge.weight}, new distance: ${newDistance})`,
        distances: { ...distances },
        previous: { ...previous },
      });
      
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currentNode.id;
        
        steps.push({
          type: 'relax',
          nodeId: neighborId,
          edgeId: edge.id,
          message: `Updated distance to ${neighborId}: ${newDistance}`,
          distances: { ...distances },
          previous: { ...previous },
        });
      }
    }
    
    // If we reached the end node, we can stop
    if (currentNode.id === endNodeId) {
      break;
    }
  }
  
  // Reconstruct the path
  const path: string[] = [];
  let current = endNodeId;
  
  while (current && current !== startNodeId) {
    path.unshift(current);
    current = previous[current];
  }
  
  if (current === startNodeId) {
    path.unshift(startNodeId);
  }
  
  steps.push({
    type: 'path',
    message: `Shortest path found: ${path.join(' → ')} (total distance: ${distances[endNodeId]})`,
    distances: { ...distances },
    previous: { ...previous },
    path,
  });
  
  steps.push({
    type: 'complete',
    message: "Dijkstra's algorithm completed!",
    distances: { ...distances },
    previous: { ...previous },
    path,
  });
  
  return steps;
}
