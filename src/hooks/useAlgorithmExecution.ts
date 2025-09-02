'use client';

import { useEffect, useCallback } from 'react';
import { useAlgorithm } from '@/context/AlgorithmContext';
import { quicksortSteps } from '@/algorithms/sorting/quicksort';
import { bubblesortSteps } from '@/algorithms/sorting/bubblesort';
import { mergesortSteps } from '@/algorithms/sorting/mergesort';
import { dijkstraSteps } from '@/algorithms/graph/dijkstra';
import { bfsSteps } from '@/algorithms/graph/bfs';
import { useGifExport, getGlobalExportOptions } from '@/hooks/useGifExport';
import type { Graph } from '@/types/graph';
import type { AlgorithmStep } from '@/types/algorithm';

export function useAlgorithmExecution() {
  const { state, dispatch, selectedAlgorithm } = useAlgorithm();
  const { captureFrame, reset: resetFrames } = useGifExport();

  const generateSteps = useCallback(() => {
    if (!selectedAlgorithm) return;
    // For sorting algorithms we require an array; for graph algorithms we don't
    const isGraphAlgo = selectedAlgorithm.category === 'graph';
    if (!isGraphAlgo && !state.data.length) return;

    // Store the original data if not already stored
    if (state.originalData.length === 0) {
      dispatch({ type: 'SET_ORIGINAL_DATA', payload: [...state.data] });
    }

    let steps: AlgorithmStep[] = [];
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
      case 'dijkstra':
        // For Dijkstra, we need to find start and end nodes
        if (!state.graph) {
          steps = [];
          break;
        }
        const startNode = state.graph.nodes.find((n) => n.isStart)?.id || 'A';
        const endNode = state.graph.nodes.find((n) => n.isEnd)?.id || 'G';
        steps = dijkstraSteps(state.graph as Graph, startNode, endNode);
        break;
      case 'bfs':
        // For BFS, we need to find start and end nodes
        if (!state.graph) {
          steps = [];
          break;
        }
        const bfsStartNode = state.graph.nodes.find((n) => n.isStart)?.id || 'A';
        const bfsEndNode = state.graph.nodes.find((n) => n.isEnd)?.id || 'G';
        steps = bfsSteps(state.graph as Graph, bfsStartNode, bfsEndNode);
        break;
      default:
        steps = [];
    }

    dispatch({ type: 'SET_STEPS', payload: steps });
  }, [selectedAlgorithm, state.data, state.originalData.length, state.graph, dispatch]);

  const executeStep = useCallback(() => {
    if (state.currentStep < state.totalSteps - 1) {
      const nextStep = state.currentStep + 1;
      const step = state.steps[nextStep];
      
      // Update the data array if the step has array data
      if ('array' in step && step.array) {
        dispatch({ type: 'SET_DATA', payload: step.array });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
      
        // Capture frame immediately after the step is executed
        const { includeUI } = getGlobalExportOptions();
        const graphRoot = document.querySelector('[data-graph-root]') as HTMLElement | null;
        const arrayRoot = document.querySelector('[data-array-root]') as HTMLElement | null;
        const graphInner = document.querySelector('[data-graph-container]') as HTMLElement | null;
        const arrayInner = document.querySelector('[data-array-container]') as HTMLElement | null;
        const container = includeUI
          ? (graphRoot || arrayRoot)
          : (graphInner || arrayInner);
      
      if (container) {
        // Give a brief time for DOM to update and animations to settle
        requestAnimationFrame(() => {
          setTimeout(() => {
            captureFrame(container, container.offsetWidth, container.offsetHeight).catch(() => {});
          }, 50); // Small delay to let animations settle
        });
      }
    } else {
      dispatch({ type: 'SET_RUNNING', payload: false });
      dispatch({ type: 'SET_PAUSED', payload: false });
    }
  }, [state.currentStep, state.totalSteps, state.steps, dispatch, captureFrame]);

  // Auto-execute when running
  useEffect(() => {
    if (state.isRunning && !state.isPaused && state.steps.length > 0) {
              const timer = setTimeout(() => {
          executeStep();
        }, state.speed);

      return () => clearTimeout(timer);
    }
  }, [state.isRunning, state.isPaused, state.currentStep, state.speed, state.steps.length, executeStep]);

  // When a new run starts, clear previous captured frames
  useEffect(() => {
    if (state.isRunning && state.currentStep === 0) {
      resetFrames();
    }
  }, [state.isRunning, state.currentStep, resetFrames]);

  // Generate steps when algorithm or data changes
  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  // Capture a final settled frame once the run completes
  useEffect(() => {
    if (!state.isRunning && state.steps.length > 0 && state.currentStep >= state.totalSteps - 1) {
      const { includeUI } = getGlobalExportOptions();
      const graphRoot = document.querySelector('[data-graph-root]') as HTMLElement | null;
      const arrayRoot = document.querySelector('[data-array-root]') as HTMLElement | null;
      const graphInner = document.querySelector('[data-graph-container]') as HTMLElement | null;
      const arrayInner = document.querySelector('[data-array-container]') as HTMLElement | null;
      const container = includeUI ? (graphRoot || arrayRoot) : (graphInner || arrayInner);
      if (container) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            captureFrame(container, container.offsetWidth, container.offsetHeight).catch(() => {});
          }, 80);
        });
      }
    }
  }, [state.isRunning, state.currentStep, state.totalSteps, state.steps.length, captureFrame]);

  return {
    generateSteps,
    executeStep,
  };
}
