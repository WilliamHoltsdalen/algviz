'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Film, Layers3, MousePointerClick, PlayCircle, Settings } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { cn } from '@/lib/utils';

// Header components for each feature
const GifExportHeader = () => (
  <div className="flex h-full w-full flex-col">
    <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-3">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>quicksort-demo.gif</span>
        <motion.button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-100 hover:bg-white/10"
          aria-label="Download example GIF"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          Download
        </motion.button>
      </div>
      <motion.div 
        className="mt-2 h-20 rounded-md bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
        animate={{ 
          background: [
            'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
            'linear-gradient(90deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))',
            'linear-gradient(90deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2))'
          ]
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
    </div>
  </div>
);

const AlgorithmsHeader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <motion.div className="grid grid-cols-3 gap-2">
      {['Quick', 'Merge', 'Bubble', 'Dijkstra', 'BFS', 'A*'].map((name, i) => (
        <motion.div
          key={name}
          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          {name}
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const ControlsHeader = () => {
  const [currentStep, setCurrentStep] = React.useState(47);
  const totalSteps = 89;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-48">
        <div className="flex items-center gap-2 mb-3">
          <motion.button
            type="button"
            className="rounded-md border border-white/15 bg-white/5 p-2 text-slate-200 hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Play animation"
          >
            <PlayCircle className="h-4 w-4" aria-hidden />
          </motion.button>
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              animate={{ width: ['0%', '100%', '0%'] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              onUpdate={(latest) => {
                // Calculate step based on progress (0-100%)
                const progress = typeof latest.width === 'string' 
                  ? parseFloat(latest.width.replace('%', '')) 
                  : 0;
                const step = Math.round((progress / 100) * totalSteps);
                setCurrentStep(step);
              }}
            />
          </div>
        </div>
        <motion.div 
          className="text-xs text-slate-300 text-center"
          key={currentStep}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Step {currentStep} of {totalSteps}
        </motion.div>
      </div>
    </div>
  );
};

const PresetsHeader = () => {
  const [currentPreset, setCurrentPreset] = React.useState(0);
  const presets = [
    { name: 'Star (weighted)', desc: 'One hub connected to all leaves' },
    { name: 'Line (chain)', desc: 'Simple path from start to end' },
    { name: 'Dense (weighted)', desc: 'More edges; good for Dijkstra' },
    { name: 'Small grid-ish', desc: 'Compact with cross connections' },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPreset((prev) => (prev + 1) % presets.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [presets.length]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-48">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-3 w-3 text-slate-400" aria-hidden />
            <span className="text-xs text-slate-300 font-medium">Graph presets</span>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPreset}
              className="rounded-md p-2 text-xs bg-white/10 border border-white/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="font-medium text-slate-200">{presets[currentPreset].name}</div>
              <div className="text-slate-400 text-[10px]">{presets[currentPreset].desc}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: 'Export as GIF',
    description: 'Capture any algorithm run as a crisp, lightweight GIF. Perfect for demos, documentation, and sharing your learning progress.',
    header: <GifExportHeader />,
    icon: <Film className="h-4 w-4 text-slate-400" aria-hidden />,
    className: 'md:col-span-2',
  },
  {
    title: 'Rich Algorithm Library',
    description: 'From sorting classics to graph traversals—explore diverse algorithms with consistent, beautiful visualizations.',
    header: <AlgorithmsHeader />,
    icon: <Layers3 className="h-4 w-4 text-slate-400" aria-hidden />,
  },
  {
    title: 'Precise Timeline Control',
    description: 'Scrub through steps, pause at key moments, or let it autoplay while you follow the logic.',
    header: <ControlsHeader />,
    icon: <PlayCircle className="h-4 w-4 text-slate-400" aria-hidden />,
  },
  {
    title: 'Smart Presets',
    description: 'Jump-start your visualizations with curated data sets. From nearly-sorted arrays to complex graph topologies.',
    header: <PresetsHeader />,
    icon: <Settings className="h-4 w-4 text-slate-400" aria-hidden />,
    className: 'md:col-span-2',
  },
];

export default function FeatureSection() {
  return (
    <section className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Built for learning in motion
          </motion.h2>
          <motion.p
            className="mt-4 text-slate-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.05, duration: 0.6 }}
          >
            Clean visuals, careful interactions, and export tools—everything you need to explain
            complex ideas clearly.
          </motion.p>
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <BentoGrid className="max-w-4xl mx-auto">
            {features.map((item, i) => (
              <BentoGridItem
                key={item.title}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={cn(
                  "border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.06]",
                  item.className
                )}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}


