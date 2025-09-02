'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { ArrayAlgorithmStep } from '@/types/algorithm';
import { quicksortSteps } from '@/algorithms/sorting/quicksort';

function generateArray(size: number, seed: number): number[] {
  // Use deterministic random based on seed to avoid hydration mismatch
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  const result: number[] = [];
  for (let i = 0; i < size; i++) {
    // Keep values in a compact range for pleasing bar heights
    const randomValue = seededRandom(seed * 100 + i);
    result.push(8 + Math.floor(randomValue * 92));
  }
  return result;
}

export default function LiveSortingPreview() {
  const [seed, setSeed] = useState(1); // Start with 1 instead of 0
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const baseArray = useMemo(() => generateArray(14, seed), [seed]);
  const steps = useMemo<ArrayAlgorithmStep[]>(() => quicksortSteps(baseArray) as ArrayAlgorithmStep[], [baseArray]);
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mounted) return;
    
    // autoplay through steps, regenerate when finished
    const play = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        setStepIndex((prev) => {
          const next = prev + 1;
          if (next >= steps.length) {
            // brief pause then regenerate a new array/animation
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            window.setTimeout(() => {
              setStepIndex(0);
              setSeed((s) => s + 1);
            }, 900);
            return prev;
          }
          return next;
        });
      }, 450);
    };
    play();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [steps, mounted]);

  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const data = (current?.array && current.array.length > 0 ? current.array : baseArray) as number[];
  const maxValue = data.length > 0 ? Math.max(...data) : 1;

  const getBarColor = (index: number) => {
    if (!current) return '#3b82f6';
    if (!('indices' in current)) return '#3b82f6';
    switch (current.type) {
      case 'compare':
        return current.indices?.includes(index) ? '#eab308' : '#3b82f6';
      case 'swap':
        return current.indices?.includes(index) ? '#ef4444' : '#3b82f6';
      case 'highlight':
        return current.indices?.includes(index) ? '#22c55e' : '#3b82f6';
      case 'move':
        return current.indices?.includes(index) ? '#8b5cf6' : '#3b82f6';
      case 'complete':
        return '#22c55e';
      default:
        return '#3b82f6';
    }
  };

  if (!mounted) {
    return (
      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-xs font-semibold text-slate-300 bg-white/10 border border-white/10 rounded px-2 py-1">
            Quicksort
          </div>
          <span className="text-xs text-slate-400">Loading...</span>
        </div>
        <div className="relative min-h-[240px] flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Preparing visualization...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden">
      {/* subtle grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-xs font-semibold text-slate-300 bg-white/10 border border-white/10 rounded px-2 py-1">
          Quicksort
        </div>
      </div>

      <div className="relative min-h-[240px] flex items-end justify-center gap-2">
        {data.map((value, index) => {
          const safe = Number.isFinite(value) ? value : 1;
          const targetHeight = 180;
          const minBarHeight = 14;
          const barHeight = Math.max(minBarHeight, (safe / maxValue) * targetHeight);
          const barWidth = Math.max(10, (100 / data.length) * 1.2);
          const baseDelay = index * 0.01;
          const barDuration = 0.28;
          const color = getBarColor(index);
          const isActive = Boolean(current && 'indices' in current && current.indices && current.indices.includes(index));

          return (
            <div key={`lp-bar-${index}`} className="relative flex flex-col items-center" style={{ width: `${barWidth}px` }}>
              <div className="relative w-full" style={{ height: `${targetHeight}px` }}>
                <motion.div
                  layout
                  className="absolute left-0 bottom-0 w-full rounded-t-lg shadow-lg overflow-hidden"
                  style={{ height: `${barHeight}px`, backgroundColor: color }}
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}px` }}
                  transition={{ duration: barDuration, delay: baseDelay }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent rounded-t-lg" />
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/25 to-transparent rounded-t-lg" />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-t-lg"
                      style={{ boxShadow: `0 0 16px ${color}40` }}
                      animate={{
                        boxShadow: [
                          `0 0 16px ${color}40`,
                          `0 0 28px ${color}60`,
                          `0 0 16px ${color}40`,
                        ],
                      }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* value label */}
                <motion.div
                  layout
                  className="absolute left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-300 bg-slate-900/70 px-1 py-0.5 rounded"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ bottom: barHeight + 4, opacity: 1, y: 0 }}
                  transition={{ delay: baseDelay + barDuration, duration: 0.22 }}
                >
                  {safe}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


