'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimelineScrubberProps = {
  currentStep: number;
  totalSteps: number;
  isRunning: boolean;
  onStepChange: (step: number) => void;
  onTogglePlay?: () => void;
};

export default function TimelineScrubber({
  currentStep,
  totalSteps,
  isRunning: _isRunning,
  onStepChange,
  onTogglePlay,
}: TimelineScrubberProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localStep, setLocalStep] = useState(currentStep);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync local step with prop when not dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalStep(currentStep);
    }
  }, [currentStep, isDragging]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if no input is focused
      if (document.activeElement?.tagName === 'INPUT') return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          onTogglePlay?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentStep > 0) {
            onStepChange(currentStep - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentStep < totalSteps - 1) {
            onStepChange(currentStep + 1);
          }
          break;
        case 'Home':
          e.preventDefault();
          onStepChange(0);
          break;
        case 'End':
          e.preventDefault();
          onStepChange(totalSteps - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps, onStepChange, onTogglePlay]);

  const handleLiveStepChange = useCallback((step: number) => {
    // Apply step changes immediately while dragging for live feedback
    setLocalStep(step);
    if (isDragging) {
      onStepChange(step);
    }
  }, [isDragging, onStepChange]);

  const updateStepFromMouse = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    const step = Math.round(progress * (totalSteps - 1));
    handleLiveStepChange(step);
  }, [totalSteps, handleLiveStepChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (totalSteps <= 1) return;
    setIsDragging(true);
    updateStepFromMouse(e);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    updateStepFromMouse(e);
  }, [isDragging, updateStepFromMouse]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onStepChange(localStep);
    }
  }, [isDragging, localStep, onStepChange]);

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, localStep, handleMouseMove, handleMouseUp]);

  if (totalSteps <= 1) {
    return (
      <div className="text-center py-4">
        <div className="text-sm text-slate-500">No steps to scrub</div>
      </div>
    );
  }

  const progress = totalSteps > 1 ? (isDragging ? localStep : currentStep) / (totalSteps - 1) : 0;

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Timeline Track */}
      <div className="relative">
        <div
          ref={trackRef}
          className={cn(
            'relative h-3 bg-white/10 rounded-full cursor-pointer border border-white/20',
            isDragging && 'cursor-grabbing'
          )}
          onMouseDown={handleMouseDown}
        >
          {/* Progress Fill */}
          <motion.div
            className="absolute left-0 top-0 h-full bg-blue-600 rounded-full"
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: isDragging ? 0 : 0.2 }}
          />
          
          {/* Thumb */}
          <motion.div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg cursor-grab',
              isDragging && 'cursor-grabbing scale-110'
            )}
            style={{ left: `${progress * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: isDragging ? 0 : 0.2 }}
          />
        </div>
      </div>

      {/* Step Info */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">
          Step {(isDragging ? localStep : currentStep) + 1} of {totalSteps}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">
            {Math.round(progress * 100)}%
          </span>
          {/* Keyboard Hints Tooltip */}
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-400 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              <div className="space-y-1">
                <div><kbd className="bg-slate-700 px-1 rounded">Space</kbd> play/pause</div>
                <div><kbd className="bg-slate-700 px-1 rounded">← →</kbd> step</div>
                <div><kbd className="bg-slate-700 px-1 rounded">Home/End</kbd> jump</div>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
