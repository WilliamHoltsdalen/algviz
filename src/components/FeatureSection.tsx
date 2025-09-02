'use client';

import { motion } from 'framer-motion';
import { Download, Film, Layers3, MousePointerClick, PlayCircle } from 'lucide-react';
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

const ControlsHeader = () => (
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
          />
        </div>
      </div>
      <div className="text-xs text-slate-300 text-center">Step 47 of 89</div>
    </div>
  </div>
);

const InspectHeader = () => (
  <div className="flex h-full w-full items-center justify-center relative">
    <motion.div 
      className="absolute rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-3 text-xs text-slate-200"
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
    >
      <div className="font-medium">Array[3]</div>
      <div className="text-slate-300">Value: 42</div>
      <div className="text-slate-300">Swaps: 3</div>
    </motion.div>
    <motion.div
      className="absolute w-2 h-2 bg-blue-400 rounded-full"
      animate={{ 
        x: [-20, 20, -20],
        y: [-10, 10, -10]
      }}
      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      aria-hidden
    />
  </div>
);

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
    title: 'Interactive Inspection',
    description: 'Click any element to reveal its current state, comparison count, or position in the algorithm flow.',
    header: <InspectHeader />,
    icon: <MousePointerClick className="h-4 w-4 text-slate-400" aria-hidden />,
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


