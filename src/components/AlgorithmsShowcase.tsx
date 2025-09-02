'use client';

import { motion } from 'framer-motion';
import { algorithms } from '@/data/algorithms';

export default function AlgorithmsShowcase() {
  const implemented = algorithms.filter(a => a.isImplemented);
  const countAll = algorithms.length;
  const countImplemented = implemented.length;

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            A growing library of algorithms
          </motion.h2>
          <motion.p
            className="mt-4 text-slate-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.05, duration: 0.6 }}
          >
            Explore sorting, graph, and pathfinding techniques. Compare steps side‑by‑side and
            understand how each approach behaves on the same data.
          </motion.p>

          <motion.div
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            aria-live="polite"
          >
            <span className="font-semibold">{countImplemented}</span>
            <span>of</span>
            <span className="font-semibold">{countAll}</span>
            <span>algorithms implemented</span>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {implemented.map((alg, index) => (
            <motion.div
              key={alg.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.04, duration: 0.45 }}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-slate-100">{alg.name}</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                  {alg.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{alg.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="rounded-md border border-white/10 bg-white/5 p-2">
                  <span className="block text-[10px] uppercase tracking-wide text-slate-400">Time</span>
                  <span className="text-slate-200">{alg.timeComplexity}</span>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-2">
                  <span className="block text-[10px] uppercase tracking-wide text-slate-400">Space</span>
                  <span className="text-slate-200">{alg.spaceComplexity}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


