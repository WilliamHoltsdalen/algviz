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
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Array Size:
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
            disabled={state.isRunning}
          />
          <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-center bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            {arraySize}
          </span>
        </div>
      </div>

      {selectedAlgorithm ? (
        <div className="space-y-4">
          {/* Visualization Area */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 min-h-[400px] flex items-end justify-center gap-2 relative overflow-hidden">
            {/* Grid lines for better visual reference */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-slate-300 dark:border-slate-600"
                  style={{ bottom: `${(i + 1) * 20}%` }}
                />
              ))}
            </div>
            
            {state.data.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                className="relative flex flex-col items-center group"
                style={{
                  width: `${Math.max(12, (100 / state.data.length) * 1.2)}px`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(value / maxValue) * 280}px` }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
              >
                {/* Value label on top */}
                <motion.div
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 bg-white/90 dark:bg-slate-800/90 px-1 py-0.5 rounded shadow-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.01 + 0.3 }}
                >
                  {value}
                </motion.div>
                
                {/* Bar */}
                <motion.div
                  className="rounded-t-lg shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                  style={{
                    width: `${Math.max(12, (100 / state.data.length) * 1.2)}px`,
                    height: `${(value / maxValue) * 280}px`,
                    backgroundColor: getBarColor(index, value),
                  }}
                  whileHover={{ scale: 1.05 }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / maxValue) * 280}px` }}
                  transition={{ duration: 0.3, delay: index * 0.01 }}
                >
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-lg" />
                  
                  {/* Shine effect */}
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-lg" />
                  
                  {/* Active state glow */}
                  {state.steps[state.currentStep]?.indices?.includes(index) && (
                    <motion.div
                      className="absolute inset-0 rounded-t-lg"
                      style={{
                        boxShadow: `0 0 20px ${getBarColor(index, value)}40`,
                      }}
                      animate={{ 
                        boxShadow: [
                          `0 0 20px ${getBarColor(index, value)}40`,
                          `0 0 30px ${getBarColor(index, value)}60`,
                          `0 0 20px ${getBarColor(index, value)}40`
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                {/* Index label at bottom */}
                <motion.div
                  className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.01 + 0.3 }}
                >
                  {index}
                </motion.div>
              </motion.div>
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
