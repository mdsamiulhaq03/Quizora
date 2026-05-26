"use client";

import { motion } from "framer-motion";

interface Props {
  value: number;
  max: number;
  className?: string;
}

export default function ProgressBar({ value, max, className = "" }: Props) {
  const filled = max > 0 ? Math.round(value) : 0;
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-px">
        {Array.from({ length: max }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 h-1.5 origin-left"
            animate={{
              backgroundColor: i < filled ? "var(--accent)" : "var(--surface-alt)",
            }}
            transition={{
              duration: 0.3,
              delay: i < filled ? i * 0.015 : 0,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">
          QUESTION{" "}
          <motion.span
            key={filled}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block tabular-nums"
          >
            {filled}
          </motion.span>
          {" "}OF {max}
        </span>
        <motion.span
          key={pct}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted tabular-nums"
        >
          {Math.round(pct)}%
        </motion.span>
      </div>
    </div>
  );
}
