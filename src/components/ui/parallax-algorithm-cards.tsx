"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Algorithm } from "@/types/algorithm";

export const ParallaxAlgorithmCards = ({
  algorithms,
  className,
}: {
  algorithms: Algorithm[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    // Start animating when the section is well in view, finish before it leaves
    offset: ["start 200%", "end 20%"],
  });

  // Keep columns aligned at entry, then ramp up movement as user progresses
  const translateFirst = useTransform(scrollYProgress, [0, 0.5, 1], [0, -60, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 0.5, 1], [0, -60, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 0.5, 1], [0, -60, -200]);

  const third = Math.ceil(algorithms.length / 3);

  const firstPart = algorithms.slice(0, third);
  const secondPart = algorithms.slice(third, 2 * third);
  const thirdPart = algorithms.slice(2 * third);

  const AlgorithmCard = ({ algorithm, index }: { algorithm: Algorithm; index: number }) => (
    <motion.div
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.04, duration: 0.45 }}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-slate-100">{algorithm.name}</h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
            {algorithm.category}
          </span>
          {!algorithm.isImplemented && (
            <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[11px] text-orange-300">
              Coming soon
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-300">{algorithm.description}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div className="rounded-md border border-white/10 bg-white/5 p-2">
          <span className="block text-[10px] uppercase tracking-wide text-slate-400">Time</span>
          <span className="text-slate-200">{algorithm.timeComplexity}</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-2">
          <span className="block text-[10px] uppercase tracking-wide text-slate-400">Space</span>
          <span className="text-slate-200">{algorithm.spaceComplexity}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div
      className={cn("w-full items-start", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-24 px-6 md:py-32 md:px-10"
      >
        <div className="grid gap-10">
          {firstPart.map((algorithm, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
            >
              <AlgorithmCard algorithm={algorithm} index={idx} />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((algorithm, idx) => (
            <motion.div 
              style={{ y: translateSecond }} 
              key={"grid-2" + idx}
            >
              <AlgorithmCard algorithm={algorithm} index={idx + third} />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((algorithm, idx) => (
            <motion.div 
              style={{ y: translateThird }} 
              key={"grid-3" + idx}
            >
              <AlgorithmCard algorithm={algorithm} index={idx + 2 * third} />
            </motion.div>
          ))}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-140 bg-gradient-to-b from-transparent to-[#0b1320]" />
    </div>
  );
};
