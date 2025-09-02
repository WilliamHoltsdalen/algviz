'use client';

import { motion } from 'framer-motion';
import LiveSortingPreview from './LiveSortingPreview';

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-100"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              Step. See. Solve.
            </motion.h1>
            <motion.p
              className="mt-6 text-lg md:text-xl text-slate-300 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Visualize algorithms with elegant, step‑by‑step animations. Built for clarity, not flash.
            </motion.p>

            <motion.div
              className="mt-10 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <a
                href="/app"
                className="inline-flex items-center justify-center rounded-md bg-white text-slate-900 px-5 py-3 text-sm font-semibold hover:bg-white/90 border border-white/10"
              >
                Try it now
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold text-slate-200 border border-white/15 bg-white/5 hover:bg-white/10"
              >
                View on GitHub
              </a>
            </motion.div>
          </div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-4 backdrop-blur-sm">
              <LiveSortingPreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


