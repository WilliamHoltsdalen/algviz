export type AlgorithmCategory = 'sorting' | 'graph' | 'tree' | 'pathfinding';

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  isImplemented: boolean;
}

// Base step interface for common properties
export interface BaseAlgorithmStep {
  type: string;
  message?: string;
}

// Array-based algorithm steps (sorting)
export interface ArrayAlgorithmStep extends BaseAlgorithmStep {
  type: 'compare' | 'swap' | 'move' | 'highlight' | 'complete';
  indices?: number[];
  values?: number[];
  array?: number[]; // Current state of the array after this step
}

// Graph-based algorithm steps
export interface GraphAlgorithmStep extends BaseAlgorithmStep {
  type: string;
  nodeId?: string;
  edgeId?: string;
  data?: any;
}

// Union type for all algorithm steps
export type AlgorithmStep = ArrayAlgorithmStep | GraphAlgorithmStep;

export interface VisualizationState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  data: number[];
  originalData: number[]; // Store the original unsorted array
  graph?: any; // Store the current graph for graph algorithms
  originalGraph?: any; // Store the original graph
  steps: AlgorithmStep[];
}

