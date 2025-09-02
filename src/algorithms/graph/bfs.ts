import { Graph } from '@/types/graph';

export interface BFSStep {
  type: 'visit' | 'explore' | 'discover' | 'path' | 'complete';
  nodeId?: string;
  edgeId?: string;
  message?: string;
  visited?: Set<string>;
  queue?: string[];
  previous?: Record<string, string>;
  path?: string[];
  level?: number;
}

export function bfsSteps(graph: Graph, startNodeId: string, endNodeId: string): BFSStep[] {
  const steps: BFSStep[] = [];
  // const nodes = [...graph.nodes];
  const edges = [...graph.edges];
  
  // Initialize tracking structures
  const visited = new Set<string>();
  const queue: string[] = [];
  const previous: Record<string, string> = {};
  const levels: Record<string, number> = {};
  
  // Start with the start node
  queue.push(startNodeId);
  levels[startNodeId] = 0;
  
  steps.push({
    type: 'visit',
    nodeId: startNodeId,
    message: `Starting BFS from node ${startNodeId}`,
    visited: new Set(visited),
    queue: [...queue],
    previous: { ...previous },
    level: 0,
  });
  
  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    
    if (visited.has(currentNodeId)) {
      continue;
    }
    
    // Mark current node as visited
    visited.add(currentNodeId);
    const currentLevel = levels[currentNodeId];
    
    steps.push({
      type: 'visit',
      nodeId: currentNodeId,
      message: `Visiting node ${currentNodeId} at level ${currentLevel}`,
      visited: new Set(visited),
      queue: [...queue],
      previous: { ...previous },
      level: currentLevel,
    });
    
    // Check if we reached the end node
    if (currentNodeId === endNodeId) {
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
        message: `Path found to ${endNodeId}: ${path.join(' → ')} (${path.length - 1} steps)`,
        visited: new Set(visited),
        queue: [...queue],
        previous: { ...previous },
        path,
        level: currentLevel,
      });
      
      break;
    }
    
    // Find all neighbors of the current node
    const neighbors = edges.filter(edge => 
      edge.from === currentNodeId || edge.to === currentNodeId
    );
    
    for (const edge of neighbors) {
      const neighborId = edge.from === currentNodeId ? edge.to : edge.from;
      
      if (visited.has(neighborId) || queue.includes(neighborId)) {
        continue;
      }
      
      // Discover new neighbor
      steps.push({
        type: 'discover',
        nodeId: neighborId,
        edgeId: edge.id,
        message: `Discovering neighbor ${neighborId} from ${currentNodeId}`,
        visited: new Set(visited),
        queue: [...queue],
        previous: { ...previous },
        level: currentLevel,
      });
      
      // Add to queue and set previous node
      queue.push(neighborId);
      previous[neighborId] = currentNodeId;
      levels[neighborId] = currentLevel + 1;
      
      steps.push({
        type: 'explore',
        nodeId: neighborId,
        edgeId: edge.id,
        message: `Added ${neighborId} to queue (level ${currentLevel + 1})`,
        visited: new Set(visited),
        queue: [...queue],
        previous: { ...previous },
        level: currentLevel + 1,
      });
    }
  }
  
  // If no path was found
  if (!visited.has(endNodeId)) {
    steps.push({
      type: 'complete',
      message: `No path found from ${startNodeId} to ${endNodeId}`,
      visited: new Set(visited),
      queue: [...queue],
      previous: { ...previous },
      level: Math.max(...Object.values(levels)),
    });
  } else {
    // Reconstruct the final path for the complete step
    const finalPath: string[] = [];
    let current = endNodeId;
    
    while (current && current !== startNodeId) {
      finalPath.unshift(current);
      current = previous[current];
    }
    
    if (current === startNodeId) {
      finalPath.unshift(startNodeId);
    }
    
    steps.push({
      type: 'complete',
      message: `BFS completed! Explored ${visited.size} nodes in ${Math.max(...Object.values(levels))} levels`,
      visited: new Set(visited),
      queue: [...queue],
      previous: { ...previous },
      path: finalPath,
      level: Math.max(...Object.values(levels)),
    });
  }
  
  return steps;
}
