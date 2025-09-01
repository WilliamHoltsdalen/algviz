'use client';

import { AlgorithmProvider } from '@/context/AlgorithmContext';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import VisualizationWrapper from '@/components/VisualizationWrapper';
import ControlPanel from '@/components/ControlPanel';
import AlgorithmInfo from '@/components/AlgorithmInfo';

export default function Home() {
  return (
    <AlgorithmProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Algorithm Visualizer
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Watch algorithms come to life with interactive step-by-step visualizations. 
              Learn how sorting, graph, and pathfinding algorithms work through beautiful animations.
            </p>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Algorithm Selection Sidebar */}
            <div className="lg:col-span-1">
              <AlgorithmSelector />
            </div>

            {/* Visualization Area */}
            <div className="lg:col-span-3 space-y-6">
              <VisualizationWrapper />
              <ControlPanel />
              <AlgorithmInfo />
            </div>
          </div>
        </div>
      </div>
    </AlgorithmProvider>
  );
}
