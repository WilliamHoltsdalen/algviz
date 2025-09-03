'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function BottomCTA() {
  return (
    <section className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-[28rem] w-[80%] rounded-[4rem] bg-gradient-to-r from-indigo-500/15 via-fuchsia-500/15 to-amber-400/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h3
            className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-100"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Ready to see algorithms come alive?
          </motion.h3>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-slate-300"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            Jump into the playground and run your first visualization in seconds.
          </motion.p>

          <motion.div
            className="mt-8 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.2, duration: 0.45 }}
          >
            <a
              href="/app"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 border border-white/10 hover:bg-white/90"
            >
              Launch app
            </a>
            <a
              href="https://github.com/WilliamHoltsdalen/algviz"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold text-slate-200 border border-white/15 bg-white/5 hover:bg-white/10"
            >
              <Star className="h-4 w-4 mr-2" aria-hidden />
              Star on GitHub
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


