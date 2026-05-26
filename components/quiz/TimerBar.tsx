"use client";

import { useEffect, useState } from "react";

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
  const barColor = pct > 50 ? "bg-green-500" : pct > 20 ? "bg-yellow-500" : "bg-hazard";
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="border border-rule bg-plate px-4 py-2">
      <div className="flex justify-between mb-1.5">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          ELAPSED / TIMER
        </span>
        <span className={`font-terminal text-xs tabular-nums font-bold ${pct <= 20 ? "text-hazard" : "text-ink"}`}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="w-full bg-plate-alt h-1">
        <div
          className={`${barColor} h-1 transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
