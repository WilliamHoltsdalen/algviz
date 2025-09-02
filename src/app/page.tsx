'use client';

import { AlgorithmProvider } from '@/context/AlgorithmContext';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import VisualizationWrapper from '@/components/VisualizationWrapper';
import ControlPanel from '@/components/ControlPanel';
import AlgorithmInfo from '@/components/AlgorithmInfo';

export default function Home() {
  return (
    <AlgorithmProvider>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-200/90 bg-clip-text text-transparent mb-3">
              Algorithm Visualizer
            </h1>
            <p className="text-lg text-slate-300 theme-muted max-w-2xl mx-auto">
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
