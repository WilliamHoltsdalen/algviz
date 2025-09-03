'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Film, Layers3, MousePointerClick, PlayCircle, Settings, Shuffle, SkipBack, SkipForward, RotateCcw, Play, Pause } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { cn } from '@/lib/utils';

// Header components for each feature
const GifExportHeader = () => {
  const [status, setStatus] = React.useState<'idle' | 'exporting' | 'ready'>('idle');
  const [progress, setProgress] = React.useState(0);
  const [cursorPhase, setCursorPhase] = React.useState<
    'off' | 'toCenter' | 'center' | 'toExport' | 'clickExport' | 'toDownload' | 'clickDownload'
  >('off');

  React.useEffect(() => {
    if (status !== 'exporting') return;
    setProgress(0);
    const startMs = Date.now();
    const durationMs = 2200;
    let rafId = 0;

    const tick = () => {
      const elapsed = Date.now() - startMs;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setStatus('ready');
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [status]);

  const isIdle = status === 'idle';
  const isExporting = status === 'exporting';
  const isReady = status === 'ready';

  // Self-running loop with a simulated cursor moving via center
  React.useEffect(() => {
    const timeouts: number[] = [];
    const durationMs = 2200;
    const exportStartDelayMs = 900;

    const runCycle = () => {
      setStatus('idle');
      setProgress(0);
      setCursorPhase('center');

      // Move to Export, then click and start exporting
      timeouts.push(window.setTimeout(() => setCursorPhase('toExport'), 450));
      timeouts.push(
        window.setTimeout(() => {
          setCursorPhase('clickExport');
          setStatus('exporting');
        }, exportStartDelayMs),
      );

      // Return to center while exporting progresses
      timeouts.push(window.setTimeout(() => setCursorPhase('toCenter'), exportStartDelayMs + 250));
      timeouts.push(window.setTimeout(() => setCursorPhase('center'), exportStartDelayMs + 550));

      // After export completes, move to Download and click
      const afterExportMs = exportStartDelayMs + durationMs;
      timeouts.push(
        window.setTimeout(() => {
          setStatus('ready');
          setCursorPhase('toDownload');
        }, afterExportMs + 100),
      );
      timeouts.push(window.setTimeout(() => setCursorPhase('clickDownload'), afterExportMs + 450));

      // Return to center, then restart loop
      timeouts.push(window.setTimeout(() => setCursorPhase('toCenter'), afterExportMs + 700));
      timeouts.push(window.setTimeout(() => setCursorPhase('center'), afterExportMs + 1000));
      timeouts.push(
        window.setTimeout(() => {
          setCursorPhase('off');
          runCycle();
        }, afterExportMs + 1300),
      );
    };

    runCycle();
    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-3 overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>quicksort-demo.gif</span>
          <motion.button
            type="button"
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium',
              isReady
                ? 'border-blue-400/30 bg-blue-500/15 text-blue-100 hover:bg-blue-500/20'
                : 'border-white/15 bg-white/5 text-slate-100 hover:bg-white/10',
            )}
            aria-label={isReady ? 'Download exported GIF' : isExporting ? 'Exporting GIF' : 'Export animation to GIF'}
            onClick={() => {
              if (isIdle) setStatus('exporting');
            }}
            disabled={!isIdle}
            whileHover={{ scale: isIdle ? 1.05 : 1.0 }}
            whileTap={{ scale: isIdle ? 0.98 : 1.0 }}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            {isReady ? 'Download' : isExporting ? 'Exporting…' : 'Export'}
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          {(isExporting || isReady) && (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="GIF export progress"
                className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/10"
              >
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    isReady ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-400 to-purple-400',
                  )}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeInOut', duration: 0.12 }}
                />
              </div>
              <div className="mt-1.5 text-[10px] text-slate-400" aria-live="polite">
                {isReady ? 'Ready to download' : `Exporting ${progress}%`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulated cursor */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10"
          initial={{ opacity: 1, scale: 1, left: '50%', top: '55%' }}
          animate={{
            opacity: cursorPhase === 'off' ? 0 : 1,
            left:
              cursorPhase === 'toExport' || cursorPhase === 'clickExport'
                ? '90%'
                : cursorPhase === 'toDownload' || cursorPhase === 'clickDownload'
                ? '90%'
                : cursorPhase === 'toCenter' || cursorPhase === 'center'
                ? '50%'
                : '50%',
            top:
              cursorPhase === 'toExport' || cursorPhase === 'clickExport'
                ? '15%'
                : cursorPhase === 'toDownload' || cursorPhase === 'clickDownload'
                ? '15%'
                : cursorPhase === 'toCenter' || cursorPhase === 'center'
                ? '55%'
                : '55%',
            scale: cursorPhase === 'clickExport' || cursorPhase === 'clickDownload' ? 0.92 : 1,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="relative">
            <MousePointerClick className="h-4 w-4 text-white/90 drop-shadow" aria-hidden />
            <AnimatePresence>
              {(cursorPhase === 'clickExport' || cursorPhase === 'clickDownload') && (
                <motion.span
                  key={cursorPhase}
                  className="absolute -left-2 -top-2 h-8 w-8 rounded-full border border-white/30"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 0.6, scale: 1.1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

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
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    const timeouts: number[] = [];

    const cycle = () => {
      setIsPlaying(false);

      // Start playing
      timeouts.push(
        window.setTimeout(() => {
          setIsPlaying(true);
        }, 1000),
      );

      // Pause
      timeouts.push(
        window.setTimeout(() => {
          setIsPlaying(false);
        }, 3000),
      );

      // Restart cycle
      timeouts.push(
        window.setTimeout(() => {
          cycle();
        }, 5000),
      );
    };

    cycle();
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-80 py-4">
        <div className="mx-auto flex items-center justify-between gap-4">
          <button type="button" className="h-12 w-12 rounded-full border border-white/15 bg-white/5 text-slate-300" aria-label="Shuffle" title="Shuffle">
            <Shuffle className="mx-auto h-5 w-5" aria-hidden />
          </button>
          <button type="button" className="h-12 w-12 rounded-full border border-white/15 bg-white/5 text-slate-300" aria-label="Previous step" title="Previous step">
            <SkipBack className="mx-auto h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            className={cn(
              'h-14 w-14 rounded-full text-white shadow-inner ring-1 ring-inset',
              isPlaying ? 'bg-red-600/90 ring-red-400/50' : 'bg-blue-600 ring-blue-400/60',
            )}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="mx-auto h-6 w-6" aria-hidden />
            ) : (
              <Play className="mx-auto h-6 w-6" aria-hidden />
            )}
          </button>
          <button type="button" className="h-12 w-12 rounded-full border border-white/15 bg-white/5 text-slate-300" aria-label="Next step" title="Next step">
            <SkipForward className="mx-auto h-5 w-5" aria-hidden />
          </button>
          <button type="button" className="h-12 w-12 rounded-full border border-white/15 bg-white/5 text-slate-300" aria-label="Reset" title="Reset">
            <RotateCcw className="mx-auto h-5 w-5" aria-hidden />
          </button>
        </div>
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
    title: 'Smart Presets',
    description: 'Jump-start your visualizations with curated data sets. From nearly-sorted arrays to complex graph topologies.',
    header: <PresetsHeader />,
    icon: <Settings className="h-4 w-4 text-slate-400" aria-hidden />,

  },
  {
    title: 'Precise Timeline Control',
    description: 'Scrub through steps, pause at key moments, or let it autoplay while you follow the logic.',
    header: <ControlsHeader />,
    icon: <PlayCircle className="h-4 w-4 text-slate-400" aria-hidden />,
    className: 'md:col-span-2',
  },
  
];

export default function FeatureSection() {
  return (
    <section id="features" className="relative">
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
            {features.map((item) => (
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


