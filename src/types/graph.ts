export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
  isStart?: boolean;
  isEnd?: boolean;
  isVisited?: boolean;
  isCurrent?: boolean;
  distance?: number;
  previous?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
  isVisited?: boolean;
  isPath?: boolean;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DijkstraStep {
  type: 'visit' | 'relax' | 'path' | 'complete';
  nodeId?: string;
  edgeId?: string;
  message?: string;
  distances?: Record<string, number>;
  previous?: Record<string, string>;
  path?: string[];
}
