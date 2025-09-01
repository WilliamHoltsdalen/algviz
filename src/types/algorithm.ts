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

export interface AlgorithmStep {
  type: 'compare' | 'swap' | 'move' | 'highlight' | 'complete';
  indices?: number[];
  values?: number[];
  message?: string;
  data?: any;
}

export interface VisualizationState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  data: number[];
  steps: AlgorithmStep[];
}
