'use client';

import { motion } from 'framer-motion';
import LiveSortingPreview from './LiveSortingPreview';
import { BackgroundGradient } from './ui/background-gradient';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import Link from 'next/link';
import { Github, Star } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="relative">
      

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
              Algorithms Visualized
            </motion.h1>
            <motion.p
              className="mt-6 text-lg md:text-xl text-slate-300 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Step‑by‑step animations that bring algorithms to life. Watch algorithms work their magic.
            </motion.p>

            <motion.div
              className="mt-10 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <Link href="/app" className="inline-block" aria-label="Open the app">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 17 
                  }}
                >
                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-xl"
                    className="dark:bg-background bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-3 text-sm font-semibold"
                  >
                    Try it now
                  </HoverBorderGradient>
                </motion.div>
              </Link>
              <Link 
                href="https://github.com/WilliamHoltsdalen/algviz" 
                target="_blank" 
                rel="noopener" 
                className="group inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-slate-200 border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Star on GitHub"
              >
                <Star className="h-4 w-4 mr-2 transition-colors group-hover:text-yellow-400" aria-hidden />
                Star on GitHub
              </Link>
            </motion.div>
          </div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            <BackgroundGradient containerClassName="rounded-3xl" animate>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur-sm">
                <LiveSortingPreview />
              </div>
            </BackgroundGradient>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


