'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Graph } from '@/types/graph';

type PreviewStep =
  | { type: 'visit'; nodeId: string }
  | { type: 'edge'; from: string; to: string }
  | { type: 'path'; nodes: string[] }
  | { type: 'complete' };

function generateDeterministicGraph(): Graph {
  // Compact fixed graph for deterministic animation
  const nodes = [
    { id: 'A', x: 90, y: 120, label: 'A', isStart: true },
    { id: 'B', x: 190, y: 60, label: 'B' },
    { id: 'C', x: 190, y: 180, label: 'C' },
    { id: 'D', x: 300, y: 60, label: 'D' },
    { id: 'E', x: 300, y: 180, label: 'E', isEnd: true },
  ];

  const edges = [
    { id: 'e1', from: 'A', to: 'B', weight: 1 },
    { id: 'e2', from: 'A', to: 'C', weight: 1 },
    { id: 'e3', from: 'B', to: 'D', weight: 1 },
    { id: 'e4', from: 'C', to: 'E', weight: 1 },
    { id: 'e5', from: 'B', to: 'C', weight: 1 },
    { id: 'e6', from: 'D', to: 'E', weight: 1 },
  ];

  return { nodes, edges };
}

function bfsPreviewSteps(graph: Graph, start: string, goal: string): PreviewStep[] {
  const steps: PreviewStep[] = [];
  const queue: string[] = [start];
  const visited = new Set<string>();
  const previous: Record<string, string> = {};

  steps.push({ type: 'visit', nodeId: start });

  while (queue.length) {
    const current = queue.shift() as string;
    if (visited.has(current)) continue;
    visited.add(current);

    if (current === goal) {
      const path: string[] = [];
      let cur: string | undefined = goal;
      while (cur) {
        path.unshift(cur);
        cur = previous[cur];
      }
      steps.push({ type: 'path', nodes: path });
      steps.push({ type: 'complete' });
      break;
    }

    const neighbors = graph.edges
      .filter((e) => e.from === current || e.to === current)
      .map((e) => (e.from === current ? e.to : e.from))
      .sort();

    for (const n of neighbors) {
      if (visited.has(n) || queue.includes(n)) continue;
      previous[n] = current;
      steps.push({ type: 'edge', from: current, to: n });
      steps.push({ type: 'visit', nodeId: n });
      queue.push(n);
    }
  }

  return steps;
}

export default function LiveGraphPreview() {
  const graph = useMemo(() => generateDeterministicGraph(), []);
  const steps = useMemo(() => bfsPreviewSteps(graph, 'A', 'E'), [graph]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          return 0;
        }
        return next;
      });
    }, 700);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [steps]);

  const active = steps[index];

  const nodeState = new Map<string, 'default' | 'visited' | 'path' | 'start' | 'end'>();
  for (const n of graph.nodes) nodeState.set(n.id, 'default');
  nodeState.set('A', 'start');
  nodeState.set('E', 'end');

  const pathNodes = new Set<string>();
  if (active && active.type === 'path') {
    for (const n of active.nodes) pathNodes.add(n);
  }

  if (active && active.type === 'visit') {
    nodeState.set(active.nodeId, 'visited');
  }
  if (pathNodes.size) {
    for (const id of pathNodes) nodeState.set(id, 'path');
  }

  const isEdgeActive = (from: string, to: string) => {
    if (!active) return false;
    if (active.type === 'edge') {
      return (
        (active.from === from && active.to === to) ||
        (active.from === to && active.to === from)
      );
    }
    if (active.type === 'path') {
      const idxFrom = active.nodes.indexOf(from);
      const idxTo = active.nodes.indexOf(to);
      return Math.abs(idxFrom - idxTo) === 1 && idxFrom !== -1 && idxTo !== -1;
    }
    return false;
  };

  return (
    <div className="relative bg-background rounded-2xl">
      <div className="relative bg-white/3 border border-white/10 rounded-2xl p-6 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="lp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lp-grid)" />
          </svg>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="text-xs font-semibold text-slate-300 bg-white/10 border border-white/10 rounded px-2 py-1">
            Pathfinding (BFS)
          </div>
        </div>

        <svg viewBox="0 0 400 240" className="w-full h-[240px]">
          <title>BFS live preview graph</title>
          {graph.edges.map((e) => {
            const from = graph.nodes.find((n) => n.id === e.from)!;
            const to = graph.nodes.find((n) => n.id === e.to)!;
            const activeEdge = isEdgeActive(e.from, e.to);
            // Yellow during exploration, Violet when showing final path
            const stroke =
              active?.type === 'path' && activeEdge ? '#8b5cf6' : activeEdge ? '#eab308' : 'rgba(255,255,255,0.16)';
            const width = activeEdge ? 3 : 2;
            return (
              <motion.line
                key={e.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={stroke}
                strokeWidth={width}
                initial={{ pathLength: 0, opacity: 0.7 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            );
          })}

          {graph.nodes.map((n) => {
            const state = nodeState.get(n.id) ?? 'default';
            const fill =
              state === 'start'
                ? '#22c55e'
                : state === 'end'
                ? '#ef4444'
                : state === 'path'
                ? '#8b5cf6'
                : state === 'visited'
                ? '#eab308'
                : '#3b82f6';

            const showRing = state === 'path' || state === 'visited';

            return (
              <g key={n.id}>
                {showRing && (
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={22}
                    fill="none"
                    stroke={fill}
                    strokeWidth={2}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                  />
                )}
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={16}
                  fill={fill}
                  stroke={n.id === 'A' || n.id === 'E' ? '#1f2937' : '#374151'}
                  strokeWidth={2}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: state === 'visited' ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="text-[11px] font-bold fill-white">
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}


