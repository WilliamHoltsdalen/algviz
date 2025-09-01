'use client';

import { motion } from 'framer-motion';
import { useAlgorithm } from '@/context/AlgorithmContext';
import { useAlgorithmExecution } from '@/hooks/useAlgorithmExecution';
import { useGifExport } from '@/hooks/useGifExport';
import { generateRandomArray } from '@/lib/utils';
import { generateRandomGraph } from '@/utils/graphGenerator';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Gauge, Shuffle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ControlPanel() {
  const { state, dispatch, selectedAlgorithm } = useAlgorithm();
  const { generateSteps } = useAlgorithmExecution();
  const { exportToGif, isExporting, reset: resetCapturedFrames } = useGifExport();

  const handlePlay = () => {
    if (state.isRunning) {
      dispatch({ type: 'SET_PAUSED', payload: !state.isPaused });
    } else {
      generateSteps();
      dispatch({ type: 'SET_RUNNING', payload: true });
    }
  };

  const handleReset = () => {
    resetCapturedFrames();
    dispatch({ type: 'RESET' });
  };

  const handleStepBack = () => {
    if (state.currentStep > 0) {
      const prevStep = state.currentStep - 1;
      const step = state.steps[prevStep];
      
      // Update the data array if the step has array data
      if ('array' in step && step.array) {
        dispatch({ type: 'SET_DATA', payload: step.array });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: prevStep });
    }
  };

  const handleStepForward = () => {
    if (state.currentStep < state.totalSteps - 1) {
      const nextStep = state.currentStep + 1;
      const step = state.steps[nextStep];
      
      // Update the data array if the step has array data
      if ('array' in step && step.array) {
        dispatch({ type: 'SET_DATA', payload: step.array });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
    }
  };

  const handleSpeedChange = (speed: number) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  };

  const handleShuffle = () => {
    if (selectedAlgorithm && !state.isRunning) {
      resetCapturedFrames();
      if (selectedAlgorithm.category === 'graph') {
        // For graph algorithms, generate a new random graph
        // Use current graph size if available, otherwise default to 8
        const currentGraphSize = state.graph?.nodes?.length || 8;
        const newGraph = generateRandomGraph(currentGraphSize);
        dispatch({ type: 'SET_GRAPH', payload: newGraph });
        dispatch({ type: 'SET_ORIGINAL_GRAPH', payload: newGraph });
        dispatch({ type: 'RESET' });
      } else {
        // For sorting algorithms, shuffle the array
        const newData = generateRandomArray(state.data.length);
        dispatch({ type: 'SET_DATA', payload: newData });
        dispatch({ type: 'SET_ORIGINAL_DATA', payload: newData });
        dispatch({ type: 'RESET' });
      }
    }
  };

  const handleExportGif = async () => {
    if (!selectedAlgorithm || state.steps.length === 0 || isExporting) return;
    const graphContainer = document.querySelector('[data-graph-container]') as HTMLElement | null;
    const arrayContainer = document.querySelector('[data-array-container]') as HTMLElement | null;
    const container = (selectedAlgorithm.category === 'graph' ? graphContainer : arrayContainer) || graphContainer || arrayContainer;
    if (!container) return;

    // Encode already captured frames; do not change visualization state
    const delayMs = Math.max(60, Math.min(state.speed, 400));
    await exportToGif({ delayMs, width: container.offsetWidth, height: container.offsetHeight });
  };

  const speedOptions = [
    { value: 2000, label: '0.5x' },
    { value: 1000, label: '1x' },
    { value: 500, label: '2x' },
    { value: 250, label: '4x' },
    { value: 125, label: '8x' },
    { value: 62, label: '16x' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
        Controls
      </h2>

      <div className="space-y-6">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Shuffle Button - only show when not running */}
          {!state.isRunning && selectedAlgorithm && (
            <motion.button
              onClick={handleShuffle}
              className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={selectedAlgorithm.category === 'graph' ? 'Generate New Random Graph' : 'Shuffle Array'}
            >
              <Shuffle className="w-5 h-5" />
            </motion.button>
          )}

          {/* Export GIF Button - show only when a run has completed and frames exist */}
          {!state.isRunning && selectedAlgorithm && state.steps.length > 0 && state.currentStep >= state.totalSteps - 1 && (
            <motion.button
              onClick={handleExportGif}
              disabled={isExporting}
              className={cn(
                'p-3 rounded-full transition-colors',
                isExporting
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              )}
              whileHover={!isExporting ? { scale: 1.05 } : {}}
              whileTap={!isExporting ? { scale: 0.95 } : {}}
              title="Export Animation to GIF"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          )}

          <motion.button
            onClick={handleStepBack}
            disabled={state.currentStep === 0}
            className={cn(
              'p-3 rounded-full transition-colors',
              state.currentStep === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200'
            )}
            whileHover={state.currentStep > 0 ? { scale: 1.05 } : {}}
            whileTap={state.currentStep > 0 ? { scale: 0.95 } : {}}
          >
            <SkipBack className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={handlePlay}
            disabled={!selectedAlgorithm || state.steps.length === 0}
            className={cn(
              'p-4 rounded-full transition-colors',
              !selectedAlgorithm || state.steps.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700'
                : state.isRunning && !state.isPaused
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            )}
            whileHover={
              selectedAlgorithm && state.steps.length > 0 ? { scale: 1.05 } : {}
            }
            whileTap={
              selectedAlgorithm && state.steps.length > 0 ? { scale: 0.95 } : {}
            }
          >
            {state.isRunning && !state.isPaused ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </motion.button>

          <motion.button
            onClick={handleStepForward}
            disabled={state.currentStep >= state.totalSteps - 1}
            className={cn(
              'p-3 rounded-full transition-colors',
              state.currentStep >= state.totalSteps - 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200'
            )}
            whileHover={state.currentStep < state.totalSteps - 1 ? { scale: 1.05 } : {}}
            whileTap={state.currentStep < state.totalSteps - 1 ? { scale: 0.95 } : {}}
          >
            <SkipForward className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={handleReset}
            disabled={!selectedAlgorithm}
            className={cn(
              'p-3 rounded-full transition-colors',
              !selectedAlgorithm
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200'
            )}
            whileHover={selectedAlgorithm ? { scale: 1.05 } : {}}
            whileTap={selectedAlgorithm ? { scale: 0.95 } : {}}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center gap-4">
          <Gauge className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Speed:</span>
          <div className="flex gap-2">
            {speedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSpeedChange(option.value)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  state.speed === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                state.isRunning && !state.isPaused
                  ? 'bg-green-500 animate-pulse'
                  : state.isPaused
                  ? 'bg-yellow-500'
                  : 'bg-slate-400'
              )}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {state.isRunning && !state.isPaused
                ? 'Running'
                : state.isPaused
                ? 'Paused'
                : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
