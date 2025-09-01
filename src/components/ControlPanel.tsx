'use client';

import { motion } from 'framer-motion';
import { useAlgorithm } from '@/context/AlgorithmContext';
import { useAlgorithmExecution } from '@/hooks/useAlgorithmExecution';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ControlPanel() {
  const { state, dispatch, selectedAlgorithm } = useAlgorithm();
  const { generateSteps } = useAlgorithmExecution();

  const handlePlay = () => {
    if (state.isRunning) {
      dispatch({ type: 'SET_PAUSED', payload: !state.isPaused });
    } else {
      generateSteps();
      dispatch({ type: 'SET_RUNNING', payload: true });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const handleStepBack = () => {
    if (state.currentStep > 0) {
      const prevStep = state.currentStep - 1;
      const step = state.steps[prevStep];
      
      // Update the data array if the step has array data
      if (step?.array) {
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
      if (step?.array) {
        dispatch({ type: 'SET_DATA', payload: step.array });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
    }
  };

  const handleSpeedChange = (speed: number) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  };

  const speedOptions = [
    { value: 2000, label: '0.5x' },
    { value: 1000, label: '1x' },
    { value: 500, label: '2x' },
    { value: 250, label: '4x' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
        Controls
      </h2>

      <div className="space-y-6">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
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
