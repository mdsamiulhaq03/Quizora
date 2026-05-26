"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  durationSeconds: number;
  onExpire?: () => void;
  paused?: boolean;
}

export default function TimerBar({ durationSeconds, onExpire, paused }: Props) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (paused) return;
    if (remaining <= 0) { onExpire?.(); return; }
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(interval); onExpire?.(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, remaining, onExpire]);

  const pct = (remaining / durationSeconds) * 100;
  const isLow = pct <= 20;
  const barColor = pct > 50 ? "#4AF626" : pct > 20 ? "#F5A623" : "#E61919";
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="border border-rule bg-plate px-4 py-2">
      <div className="flex justify-between mb-1.5">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          TIMER
        </span>
        <motion.span
          animate={isLow ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={isLow ? { repeat: Infinity, duration: 0.9, ease: "easeInOut" } : {}}
          className={`font-terminal text-xs tabular-nums font-bold ${isLow ? "text-hazard" : "text-ink"}`}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </motion.span>
      </div>
      <div className="w-full bg-plate-alt h-1 overflow-hidden">
        <motion.div
          className="h-1 origin-left"
          animate={{ width: `${pct}%`, backgroundColor: barColor }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </div>
    </div>
  );
}
