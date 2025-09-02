'use client';

import { useAlgorithm } from '@/context/AlgorithmContext';
import { Clock, Cpu, Info } from 'lucide-react';

export default function AlgorithmInfo() {
  const { selectedAlgorithm } = useAlgorithm();

  if (!selectedAlgorithm) {
    return (
      <div className="theme-panel p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">
          Algorithm Information
        </h2>
        <div className="text-center py-8 text-slate-500">
          Select an algorithm to view detailed information
        </div>
      </div>
    );
  }

  return (
    <div className="theme-panel p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-200">
        Algorithm Information
      </h2>

      <div className="space-y-6">
        {/* Algorithm Name and Category */}
        <div>
          <h3 className="text-2xl font-bold text-slate-200 mb-2">
            {selectedAlgorithm.name}
          </h3>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-600/20 text-blue-200 border border-blue-600/40 text-sm font-medium">
            {selectedAlgorithm.category.charAt(0).toUpperCase() + selectedAlgorithm.category.slice(1)}
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-slate-400" />
            <h4 className="font-semibold text-slate-200">Description</h4>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {selectedAlgorithm.description}
          </p>
        </div>

        {/* Complexity Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <h4 className="font-semibold text-slate-200">Time Complexity</h4>
            </div>
            <p className="text-slate-400 font-mono">
              {selectedAlgorithm.timeComplexity}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-slate-400" />
              <h4 className="font-semibold text-slate-200">Space Complexity</h4>
            </div>
            <p className="text-slate-400 font-mono">
              {selectedAlgorithm.spaceComplexity}
            </p>
          </div>
        </div>

        {/* Algorithm-specific information */}
        <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-600/20">
          <h4 className="font-semibold text-slate-200 mb-2">
            How it works:
          </h4>
          <div className="text-slate-300">
            {selectedAlgorithm.category === 'sorting' && (
              <ul className="list-disc list-inside space-y-1">
                <li>Watch as elements are compared and swapped</li>
                <li>Observe the step-by-step sorting process</li>
                <li>Notice how the algorithm maintains its invariant</li>
              </ul>
            )}
            {selectedAlgorithm.category === 'graph' && (
              <ul className="list-disc list-inside space-y-1">
                <li>See how nodes are visited and explored</li>
                <li>Watch the algorithm traverse the graph structure</li>
                <li>Observe the pathfinding decision-making process</li>
              </ul>
            )}
            {selectedAlgorithm.category === 'pathfinding' && (
              <ul className="list-disc list-inside space-y-1">
                <li>Watch the algorithm explore possible paths</li>
                <li>See how it evaluates and chooses the best route</li>
                <li>Observe the final optimal path being constructed</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
