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

    // Store the original data if not already stored
    if (state.originalData.length === 0) {
      dispatch({ type: 'SET_ORIGINAL_DATA', payload: [...state.data] });
    }

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
  }, [selectedAlgorithm, state.data, state.originalData.length, dispatch]);

  const executeStep = useCallback(() => {
    if (state.currentStep < state.totalSteps - 1) {
      const nextStep = state.currentStep + 1;
      const step = state.steps[nextStep];
      
      // Update the data array if the step has array data
      if (step?.array) {
        dispatch({ type: 'SET_DATA', payload: step.array });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
    } else {
      dispatch({ type: 'SET_RUNNING', payload: false });
      dispatch({ type: 'SET_PAUSED', payload: false });
    }
  }, [state.currentStep, state.totalSteps, state.steps, dispatch]);

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
