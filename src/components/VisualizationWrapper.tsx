'use client';

import { useAlgorithm } from '@/context/AlgorithmContext';
import VisualizationCanvas from './VisualizationCanvas';
import GraphVisualization from './GraphVisualization';

export default function VisualizationWrapper() {
  const { selectedAlgorithm } = useAlgorithm();

  // Show graph visualization for graph algorithms, array visualization for others
  if (selectedAlgorithm?.category === 'graph') {
    return <GraphVisualization />;
  }

  return <VisualizationCanvas />;
}
