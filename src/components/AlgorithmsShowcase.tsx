'use client';

import { motion } from 'framer-motion';
import { algorithms } from '@/data/algorithms';
import { ParallaxAlgorithmCards } from '@/components/ui/parallax-algorithm-cards';

export default function AlgorithmsShowcase() {
  return (
    <section id="algorithms" className="relative">

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
        </div>

        <div className="mt-12 relative">
          <ParallaxAlgorithmCards algorithms={algorithms} />
        </div>
      </div>
    </section>
  );
}


