'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { algorithms, getAlgorithmsByCategory } from '@/data/algorithms';
import { useAlgorithm } from '@/context/AlgorithmContext';
import { Algorithm } from '@/types/algorithm';
import { cn } from '@/lib/utils';
import { Play, Lock } from 'lucide-react';

const categories = [
  { id: 'sorting', name: 'Sorting', color: 'bg-blue-500' },
  { id: 'graph', name: 'Graph', color: 'bg-green-500' },
  { id: 'pathfinding', name: 'Pathfinding', color: 'bg-purple-500' },
  { id: 'tree', name: 'Tree', color: 'bg-orange-500' },
];

export default function AlgorithmSelector() {
  const [selectedCategory, setSelectedCategory] = useState('sorting');
  const { selectedAlgorithm, setSelectedAlgorithm } = useAlgorithm();

  const handleAlgorithmSelect = (algorithm: Algorithm) => {
    if (algorithm.isImplemented) {
      setSelectedAlgorithm(algorithm);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
        Choose Algorithm
      </h2>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category.id
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Algorithm List */}
      <div className="space-y-2">
        {getAlgorithmsByCategory(selectedCategory).map((algorithm) => (
          <motion.button
            key={algorithm.id}
            onClick={() => handleAlgorithmSelect(algorithm)}
            disabled={!algorithm.isImplemented}
            className={cn(
              'w-full p-3 rounded-lg text-left transition-all duration-200',
              'border border-slate-200 dark:border-slate-700',
              selectedAlgorithm?.id === algorithm.id
                ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700',
              !algorithm.isImplemented && 'opacity-50 cursor-not-allowed'
            )}
            whileHover={algorithm.isImplemented ? { scale: 1.02 } : {}}
            whileTap={algorithm.isImplemented ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-slate-800 dark:text-slate-200">
                  {algorithm.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {algorithm.description}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-500">
                  <span>Time: {algorithm.timeComplexity}</span>
                  <span>Space: {algorithm.spaceComplexity}</span>
                </div>
              </div>
              <div className="ml-3">
                {algorithm.isImplemented ? (
                  <Play className="w-5 h-5 text-blue-600" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {getAlgorithmsByCategory(selectedCategory).length === 0 && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          No algorithms available in this category yet.
        </div>
      )}
    </div>
  );
}
