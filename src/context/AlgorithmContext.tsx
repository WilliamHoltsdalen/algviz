'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Algorithm, VisualizationState, AlgorithmStep } from '@/types/algorithm';

interface AlgorithmContextType {
  state: VisualizationState;
  dispatch: React.Dispatch<AlgorithmAction>;
  selectedAlgorithm: Algorithm | null;
  setSelectedAlgorithm: (algorithm: Algorithm | null) => void;
}

type AlgorithmAction =
  | { type: 'SET_DATA'; payload: number[] }
  | { type: 'SET_ORIGINAL_DATA'; payload: number[] }
  | { type: 'SET_STEPS'; payload: AlgorithmStep[] }
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'SET_PAUSED'; payload: boolean }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'RESET' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

const initialState: VisualizationState = {
  isRunning: false,
  isPaused: false,
  currentStep: 0,
  totalSteps: 0,
  speed: 1000,
  data: [],
  originalData: [],
  steps: [],
};

function algorithmReducer(state: VisualizationState, action: AlgorithmAction): VisualizationState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_ORIGINAL_DATA':
      return { ...state, originalData: action.payload };
    case 'SET_STEPS':
      return { ...state, steps: action.payload, totalSteps: action.payload.length };
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'SET_PAUSED':
      return { ...state, isPaused: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'RESET':
      return { 
        ...initialState, 
        data: state.originalData, 
        originalData: state.originalData,
        steps: state.steps 
      };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    default:
      return state;
  }
}

const AlgorithmContext = createContext<AlgorithmContextType | undefined>(undefined);

export function AlgorithmProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(algorithmReducer, initialState);
  const [selectedAlgorithm, setSelectedAlgorithm] = React.useState<Algorithm | null>(null);

  return (
    <AlgorithmContext.Provider value={{ state, dispatch, selectedAlgorithm, setSelectedAlgorithm }}>
      {children}
    </AlgorithmContext.Provider>
  );
}

export function useAlgorithm() {
  const context = useContext(AlgorithmContext);
  if (context === undefined) {
    throw new Error('useAlgorithm must be used within an AlgorithmProvider');
  }
  return context;
}
