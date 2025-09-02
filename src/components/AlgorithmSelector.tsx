'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getAlgorithmsByCategory } from '@/data/algorithms';
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
    <div className="theme-panel p-6">
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
                ? 'bg-blue-600/20 text-blue-200 border border-blue-600/40'
                : 'bg-transparent text-slate-300 hover:bg-white/5 border border-white/10'
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
              'border border-white/10 bg-white/2',
              selectedAlgorithm?.id === algorithm.id
                ? 'bg-blue-600/10 border-blue-600/40'
                : 'hover:bg-white/5',
              !algorithm.isImplemented && 'opacity-50 cursor-not-allowed'
            )}
            whileHover={algorithm.isImplemented ? { scale: 1.02 } : {}}
            whileTap={algorithm.isImplemented ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-slate-200">
                  {algorithm.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {algorithm.description}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>Time: {algorithm.timeComplexity}</span>
                  <span>Space: {algorithm.spaceComplexity}</span>
                </div>
              </div>
              <div className="ml-3">
                {algorithm.isImplemented ? (
                  <Play className="w-5 h-5 text-blue-400" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {getAlgorithmsByCategory(selectedCategory).length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No algorithms available in this category yet.
        </div>
      )}
    </div>
  );
}
