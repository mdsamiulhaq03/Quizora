"use client";

import { useState } from "react";

interface Props {
  streak: number;
  freezeUsed: boolean;
}

const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function StreakTracker({ streak, freezeUsed }: Props) {
  const [freezeActive, setFreezeActive] = useState(freezeUsed);
  const filled = Math.min(streak, 7);

  return (
    <div className="bg-plate border border-rule ind-surface">
      {/* Header */}
      <div className="border-b border-rule px-4 py-2 flex items-center justify-between">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          STREAK / ACTIVITY
        </span>
        <span className="font-display text-hazard" style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
          {streak}
        </span>
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 divide-x divide-rule-faint border-b border-rule">
        {dayLabels.map((day, i) => (
          <div key={day} className="flex flex-col items-center py-3">
            <div
              className={`w-5 h-5 mb-1.5 flex items-center justify-center ${
                i < filled ? "bg-hazard" : "bg-plate-alt border border-rule-faint"
              }`}
            >
              {i < filled && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="font-terminal text-[0.5rem] uppercase tracking-wide text-ink-muted">{day[0]}</span>
          </div>
        ))}
      </div>

      {/* Subtext + freeze */}
      <div className="px-4 py-3">
        <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mb-3">
          {streak} CONSECUTIVE DAY{streak !== 1 ? "S" : ""} ACTIVE
        </p>
        {!freezeActive ? (
          <button
            onClick={() => setFreezeActive(true)}
            className="w-full font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink-muted py-2 hover:border-hazard hover:text-hazard transition-colors"
          >
            [ USE STREAK FREEZE ]
          </button>
        ) : (
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted text-center">
            FREEZE DEPLOYED · WEEK PROTECTED
          </p>
        )}
      </div>
    </div>
  );
}
