'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAlgorithm } from '@/context/AlgorithmContext';
import { Graph, GraphNode, GraphEdge } from '@/types/graph';
import { generateSampleGraph, generateRandomGraph } from '@/utils/graphGenerator';
import { DijkstraStep } from '@/types/graph';
import { BFSStep } from '@/algorithms/graph/bfs';

export default function GraphVisualization() {
  const { state, dispatch, selectedAlgorithm } = useAlgorithm();
  const [graph, setGraph] = useState<Graph>(generateSampleGraph());
  const [graphSize, setGraphSize] = useState(7);

  // Generate new graph when algorithm changes
  useEffect(() => {
    if (selectedAlgorithm?.category === 'graph') {
      const newGraph = graphSize <= 7 ? generateSampleGraph() : generateRandomGraph(graphSize);
      setGraph(newGraph);
      dispatch({ type: 'SET_GRAPH', payload: newGraph });
      dispatch({ type: 'SET_ORIGINAL_GRAPH', payload: newGraph });
      dispatch({ type: 'RESET' });
    }
  }, [selectedAlgorithm, graphSize, dispatch]);

  const getNodeColor = (nodeId: string) => {
    const currentStep = state.steps[state.currentStep];
    if (!currentStep) return '#3b82f6'; // blue-500

    // Handle Dijkstra steps
    if ('distances' in currentStep) {
      const dijkstraStep = currentStep as DijkstraStep;
      switch (dijkstraStep.type) {
        case 'visit':
          if (dijkstraStep.nodeId === nodeId) {
            return '#ef4444'; // red-500 - currently visiting
          }
          if (dijkstraStep.distances?.[nodeId] !== undefined && dijkstraStep.distances[nodeId] < Infinity) {
            return '#22c55e'; // green-500 - visited
          }
          break;
        case 'relax':
          if (dijkstraStep.nodeId === nodeId) {
            return '#eab308'; // yellow-500 - being relaxed
          }
          if (dijkstraStep.distances?.[nodeId] !== undefined && dijkstraStep.distances[nodeId] < Infinity) {
            return '#22c55e'; // green-500 - visited
          }
          break;
        case 'path':
          if (dijkstraStep.path?.includes(nodeId)) {
            return '#8b5cf6'; // violet-500 - on shortest path
          }
          if (dijkstraStep.distances?.[nodeId] !== undefined && dijkstraStep.distances[nodeId] < Infinity) {
            return '#22c55e'; // green-500 - visited
          }
          break;
        case 'complete':
          // In the final step, prioritize showing the path
          if (dijkstraStep.path?.includes(nodeId)) {
            return '#8b5cf6'; // violet-500 - on shortest path
          }
          // Only show visited nodes as green if they're not on the path
          if (dijkstraStep.distances?.[nodeId] !== undefined && dijkstraStep.distances[nodeId] < Infinity && !dijkstraStep.path?.includes(nodeId)) {
            return '#22c55e'; // green-500 - visited but not on path
          }
          break;
      }
    }

    // Handle BFS steps
    if ('visited' in currentStep) {
      const bfsStep = currentStep as BFSStep;
      switch (bfsStep.type) {
        case 'visit':
          if (bfsStep.nodeId === nodeId) {
            return '#ef4444'; // red-500 - currently visiting
          }
          if (bfsStep.visited?.has(nodeId)) {
            return '#22c55e'; // green-500 - visited
          }
          break;
        case 'discover':
          if (bfsStep.nodeId === nodeId) {
            return '#f59e0b'; // amber-500 - being discovered
          }
          if (bfsStep.visited?.has(nodeId)) {
            return '#22c55e'; // green-500 - visited
          }
          break;
        case 'explore':
          if (bfsStep.nodeId === nodeId) {
            return '#eab308'; // yellow-500 - being explored
          }
          if (bfsStep.visited?.has(nodeId)) {
            return '#22c55e'; // green-500 - visited
          }
          break;
        case 'path':
          if (bfsStep.path?.includes(nodeId)) {
            return '#8b5cf6'; // violet-500 - on path
          }
          if (bfsStep.visited?.has(nodeId)) {
            return '#22c55e'; // green-500 - visited
          }
          break;
        case 'complete':
          // In the final step, prioritize showing the path
          if (bfsStep.path?.includes(nodeId)) {
            return '#8b5cf6'; // violet-500 - on path
          }
          // Only show visited nodes as green if they're not on the path
          if (bfsStep.visited?.has(nodeId) && !bfsStep.path?.includes(nodeId)) {
            return '#22c55e'; // green-500 - visited but not on path
          }
          break;
      }
    }

    return '#3b82f6'; // blue-500 - unvisited
  };

  const getEdgeColor = (edgeId: string) => {
    const currentStep = state.steps[state.currentStep];
    if (!currentStep) return '#6b7280'; // gray-500

    // Handle Dijkstra steps
    if ('distances' in currentStep) {
      const dijkstraStep = currentStep as DijkstraStep;
      switch (dijkstraStep.type) {
        case 'relax':
          if (dijkstraStep.edgeId === edgeId) {
            return '#eab308'; // yellow-500 - being relaxed
          }
          break;
        case 'path':
          if (dijkstraStep.path) {
            const edge = graph.edges.find(e => e.id === edgeId);
            if (edge && dijkstraStep.path.includes(edge.from) && dijkstraStep.path.includes(edge.to)) {
              return '#8b5cf6'; // violet-500 - on shortest path
            }
          }
          break;
        case 'complete':
          if (dijkstraStep.path) {
            const edge = graph.edges.find(e => e.id === edgeId);
            if (edge && dijkstraStep.path.includes(edge.from) && dijkstraStep.path.includes(edge.to)) {
              return '#8b5cf6'; // violet-500 - on shortest path
            }
          }
          break;
      }
    }

    // Handle BFS steps
    if ('visited' in currentStep) {
      const bfsStep = currentStep as BFSStep;
      switch (bfsStep.type) {
        case 'discover':
          if (bfsStep.edgeId === edgeId) {
            return '#f59e0b'; // amber-500 - being discovered
          }
          break;
        case 'explore':
          if (bfsStep.edgeId === edgeId) {
            return '#eab308'; // yellow-500 - being explored
          }
          break;
        case 'path':
          if (bfsStep.path) {
            const edge = graph.edges.find(e => e.id === edgeId);
            if (edge && bfsStep.path.includes(edge.from) && bfsStep.path.includes(edge.to)) {
              return '#8b5cf6'; // violet-500 - on path
            }
          }
          break;
        case 'complete':
          if (bfsStep.path) {
            const edge = graph.edges.find(e => e.id === edgeId);
            if (edge && bfsStep.path.includes(edge.from) && bfsStep.path.includes(edge.to)) {
              return '#8b5cf6'; // violet-500 - on path
            }
          }
          break;
      }
    }

    return '#6b7280'; // gray-500 - default
  };

  const getNodeDistance = (nodeId: string) => {
    const currentStep = state.steps[state.currentStep] as DijkstraStep;
    if (!currentStep?.distances?.[nodeId]) return '';
    
    const distance = currentStep.distances[nodeId];
    return distance === Infinity ? '∞' : distance.toString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Graph Visualization
        </h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Graph Size:
          </label>
          <input
            type="range"
            min="5"
            max="12"
            value={graphSize}
            onChange={(e) => setGraphSize(Number(e.target.value))}
            className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600"
            disabled={state.isRunning}
          />
          <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-center bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
            {graphSize}
          </span>
        </div>
      </div>

      {selectedAlgorithm ? (
        <div className="space-y-4">
          {/* Graph Visualization Area */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 min-h-[500px] relative overflow-hidden">
            <svg
              width="100%"
              height="500"
              className="absolute inset-0"
              viewBox="0 0 500 400"
            >
              {/* Edges */}
              {graph.edges.map((edge) => {
                const fromNode = graph.nodes.find(n => n.id === edge.from);
                const toNode = graph.nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                return (
                  <motion.g key={edge.id}>
                    {/* Edge line */}
                    <motion.line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={getEdgeColor(edge.id)}
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    {/* Edge weight label */}
                    <motion.text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold fill-slate-700 dark:fill-slate-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {edge.weight}
                    </motion.text>
                  </motion.g>
                );
              })}

              {/* Nodes */}
              {graph.nodes.map((node) => (
                <motion.g key={node.id}>
                  {/* Node circle */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={getNodeColor(node.id)}
                    stroke={node.isStart || node.isEnd ? '#1f2937' : '#374151'}
                    strokeWidth="3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  />
                  {/* Node label */}
                  <motion.text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-bold fill-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {node.label}
                  </motion.text>
                  {/* Distance label */}
                  {getNodeDistance(node.id) && (
                    <motion.text
                      x={node.x}
                      y={node.y + 35}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold fill-slate-600 dark:fill-slate-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      d: {getNodeDistance(node.id)}
                    </motion.text>
                  )}
                </motion.g>
              ))}
            </svg>
          </div>

          {/* Legend and Level Info */}
          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Legend:</h4>
              {/* BFS Level Indicator */}
              {state.steps.length > 0 && 'visited' in state.steps[state.currentStep] && (
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Current Level: {state.steps[state.currentStep].level || 0}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Visited: {state.steps[state.currentStep].visited?.size || 0} nodes
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-slate-600 dark:text-slate-400">Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-slate-600 dark:text-slate-400">Currently Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-slate-600 dark:text-slate-400">Being Relaxed/Explored</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-slate-600 dark:text-slate-400">Being Discovered (BFS)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-slate-600 dark:text-slate-400">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-violet-500"></div>
                <span className="text-slate-600 dark:text-slate-400">Path</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[500px] text-slate-500 dark:text-slate-400">
          <div className="text-center">
            <div className="text-6xl mb-4">🕸️</div>
            <p className="text-lg">Select a graph algorithm to start visualizing</p>
          </div>
        </div>
      )}
    </div>
  );
}
