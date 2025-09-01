'use client';

import { useEffect, useCallback } from 'react';
import { useAlgorithm } from '@/context/AlgorithmContext';
import { quicksortSteps } from '@/algorithms/sorting/quicksort';
import { bubblesortSteps } from '@/algorithms/sorting/bubblesort';
import { mergesortSteps } from '@/algorithms/sorting/mergesort';

export function useAlgorithmExecution() {
  const { state, dispatch, selectedAlgorithm } = useAlgorithm();

  const generateSteps = useCallback(() => {
    if (!selectedAlgorithm || !state.data.length) return;

    let steps;
    switch (selectedAlgorithm.id) {
      case 'quicksort':
        steps = quicksortSteps(state.data);
        break;
      case 'bubblesort':
        steps = bubblesortSteps(state.data);
        break;
      case 'mergesort':
        steps = mergesortSteps(state.data);
        break;
      default:
        steps = [];
    }

    dispatch({ type: 'SET_STEPS', payload: steps });
  }, [selectedAlgorithm, state.data, dispatch]);

  const executeStep = useCallback(() => {
    if (state.currentStep < state.totalSteps - 1) {
      dispatch({ type: 'NEXT_STEP' });
    } else {
      dispatch({ type: 'SET_RUNNING', payload: false });
      dispatch({ type: 'SET_PAUSED', payload: false });
    }
  }, [state.currentStep, state.totalSteps, dispatch]);

  // Auto-execute when running
  useEffect(() => {
    if (state.isRunning && !state.isPaused && state.steps.length > 0) {
      const timer = setTimeout(() => {
        executeStep();
      }, state.speed);

      return () => clearTimeout(timer);
    }
  }, [state.isRunning, state.isPaused, state.currentStep, state.speed, executeStep]);

  // Generate steps when algorithm or data changes
  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  return {
    generateSteps,
    executeStep,
  };
}
