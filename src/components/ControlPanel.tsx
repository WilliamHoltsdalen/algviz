'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useAlgorithm } from '@/context/AlgorithmContext';
import { useAlgorithmExecution } from '@/hooks/useAlgorithmExecution';
import { useGifExport } from '@/hooks/useGifExport';
import { generateRandomArray } from '@/lib/utils';
import { generateRandomGraph } from '@/utils/graphGenerator';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Gauge, Shuffle, Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ControlPanel() {
  const { state, dispatch, selectedAlgorithm } = useAlgorithm();
  const { generateSteps } = useAlgorithmExecution();
  const { exportToGif, isExporting, reset: resetCapturedFrames, setExportOptions } = useGifExport();
  const [exportSettingsOpen, setExportSettingsOpen] = useState(false);
  const [loop, setLoop] = useState(true);
  const [includeUI, setIncludeUI] = useState(false);
  const [delayMs, setDelayMs] = useState(200);

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
    
    toast.info('Starting GIF export...', {
      description: 'This may take a few moments depending on the number of frames.',
    });
    
    const graphContainer = document.querySelector('[data-graph-root]') as HTMLElement | null;
    const arrayContainer = document.querySelector('[data-array-root]') as HTMLElement | null;
    const container = (selectedAlgorithm.category === 'graph' ? graphContainer : arrayContainer) || graphContainer || arrayContainer;
    if (!container) return;

    try {
      await exportToGif({ 
        width: container.offsetWidth, 
        height: container.offsetHeight
      });
      toast.success('GIF exported successfully!', {
        description: 'Your animation has been downloaded.',
      });
      setExportSettingsOpen(false);
    } catch (error) {
      toast.error('Export failed', {
        description: 'There was an error creating your GIF. Please try again.',
      });
    }
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Controls
        </h2>
        <div className="flex items-center gap-2">
          {/* Export Button */}
          {!state.isRunning && selectedAlgorithm && state.steps.length > 0 && state.currentStep >= state.totalSteps - 1 && (
            <motion.button
              onClick={() => setExportSettingsOpen(true)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 transition-colors rounded-md border border-slate-300 dark:border-slate-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Export Animation to GIF"
            >
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </motion.button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Shuffle Button  */}
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
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700">
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

      {/* Export Settings Modal */}
      <Dialog.Root open={exportSettingsOpen} onOpenChange={setExportSettingsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md z-50 border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                GIF Export Settings
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="space-y-5">
              <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={loop}
                  onChange={(e) => { setLoop(e.target.checked); setExportOptions({ loop: e.target.checked }); }}
                  className="accent-blue-600"
                />
                Loop GIF
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeUI}
                  onChange={(e) => { setIncludeUI(e.target.checked); setExportOptions({ includeUI: e.target.checked }); }}
                  className="accent-blue-600"
                />
                {selectedAlgorithm?.category === 'graph' ? 'Include legend' : 'Include progress bar'}
              </label>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Frame delay: {delayMs}ms
                </label>
                <input
                  type="range"
                  min="40"
                  max="800"
                  step="20"
                  value={delayMs}
                  onChange={(e) => { const v = Number(e.target.value); setDelayMs(v); setExportOptions({ delayMs: v }); }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Fast (40ms)</span>
                  <span>Slow (800ms)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center">
              Settings only affect future exports, not the current run speed.
            </div>

            {/* Export Button - only show when a run has completed and frames exist */}
            {!state.isRunning && selectedAlgorithm && state.steps.length > 0 && state.currentStep >= state.totalSteps - 1 && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={resetCapturedFrames}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 transition-colors rounded-md border border-slate-300 dark:border-slate-500"
                >
                  Clear Frames
                </button>
                <Dialog.Close asChild>
                  <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 transition-colors rounded-md border border-slate-300 dark:border-slate-500">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleExportGif}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? 'Exporting...' : 'Export to GIF'}
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
