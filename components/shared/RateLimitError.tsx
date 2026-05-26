"use client";

import { useState, useEffect } from "react";

interface Props {
  message: string;
  resetsAt?: Date;
}

export default function RateLimitError({ message, resetsAt }: Props) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!resetsAt) return;
    const update = () => {
      const ms = new Date(resetsAt).getTime() - Date.now();
      if (ms <= 0) { setCountdown("NOW"); return; }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      setCountdown(`${h}H ${m}M`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [resetsAt]);

  return (
    <div className="border border-hazard bg-plate">
      <div className="border-b border-hazard px-4 py-1.5 bg-hazard">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-white">
          ✗ ERROR
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="font-terminal text-[0.65rem] uppercase tracking-wide text-hazard leading-relaxed">
          {message.toUpperCase()}
        </p>
        {resetsAt && countdown && (
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-1">
            RESETS IN: {countdown}
          </p>
        )}
      </div>
    </div>
  );
}
