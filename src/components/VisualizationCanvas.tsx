'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAlgorithm } from '@/context/AlgorithmContext';
import { generateRandomArray } from '@/lib/utils';
import { AlgorithmStep } from '@/types/algorithm';

export default function VisualizationCanvas() {
  const { state, dispatch, selectedAlgorithm } = useAlgorithm();
  const [arraySize, setArraySize] = useState(20);

  // Generate new random array when algorithm changes
  useEffect(() => {
    if (selectedAlgorithm) {
      const newData = generateRandomArray(arraySize);
      dispatch({ type: 'SET_DATA', payload: newData });
      dispatch({ type: 'RESET' });
    }
  }, [selectedAlgorithm, arraySize, dispatch]);

  const getBarColor = (index: number, value: number) => {
    const currentStep = state.steps[state.currentStep];
    if (!currentStep) return '#3b82f6'; // blue-500

    switch (currentStep.type) {
      case 'compare':
        if (currentStep.indices?.includes(index)) {
          return '#eab308'; // yellow-500
        }
        break;
      case 'swap':
        if (currentStep.indices?.includes(index)) {
          return '#ef4444'; // red-500
        }
        break;
      case 'highlight':
        if (currentStep.indices?.includes(index)) {
          return '#22c55e'; // green-500
        }
        break;
      case 'move':
        if (currentStep.indices?.includes(index)) {
          return '#8b5cf6'; // violet-500
        }
        break;
      case 'complete':
        return '#22c55e'; // green-500
    }

    return '#3b82f6'; // blue-500
  };

  const maxValue = Math.max(...state.data);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Visualization
        </h2>
        <div className="flex items-center gap-4">
          <label className="text-sm text-slate-600 dark:text-slate-400">
            Array Size:
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-20"
            disabled={state.isRunning}
          />
          <span className="text-sm font-mono text-slate-600 dark:text-slate-400 w-8">
            {arraySize}
          </span>
        </div>
      </div>

      {selectedAlgorithm ? (
        <div className="space-y-4">
          {/* Visualization Area */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 min-h-[300px] flex items-end justify-center gap-1">
            {state.data.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                className="bg-blue-500 rounded-t transition-colors duration-300"
                style={{
                  width: `${Math.max(4, (100 / state.data.length) * 0.8)}px`,
                  height: `${(value / maxValue) * 200}px`,
                  backgroundColor: getBarColor(index, value),
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxValue) * 200}px` }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
              />
            ))}
          </div>

          {/* Step Information */}
          {state.steps.length > 0 && (
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Step {state.currentStep + 1} of {state.totalSteps}
                </span>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mx-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((state.currentStep + 1) / state.totalSteps) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {Math.round(((state.currentStep + 1) / state.totalSteps) * 100)}%
                </span>
              </div>
              {state.steps[state.currentStep]?.message && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {state.steps[state.currentStep].message}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-slate-400">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-lg">Select an algorithm to start visualizing</p>
          </div>
        </div>
      )}
    </div>
  );
}
