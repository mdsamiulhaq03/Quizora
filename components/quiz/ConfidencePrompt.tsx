"use client";

import type { Confidence } from "@/lib/types";

interface Props {
  onSelect: (confidence: Confidence) => void;
}

const options: { value: Confidence; label: string; code: string }[] = [
  { value: "low",    label: "NOT SURE",      code: "LOW" },
  { value: "medium", label: "SOMEWHAT SURE", code: "MED" },
  { value: "high",   label: "VERY SURE",     code: "HIGH" },
];

export default function ConfidencePrompt({ onSelect }: Props) {
  return (
    <div className="bg-plate border border-rule ind-surface">
      <div className="border-b border-rule px-4 py-2">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          CONFIDENCE CALIBRATION
        </span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-rule">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="py-4 font-terminal text-[0.65rem] uppercase tracking-widest text-ink hover:bg-plate-alt hover:text-hazard transition-colors text-center"
          >
            <span className="block text-ink-muted text-[0.55rem] mb-1">{opt.code}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
