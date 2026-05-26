interface Props {
  value: number;
  max: number;
  className?: string;
  color?: string;
}

export default function ProgressBar({ value, max, className = "" }: Props) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const filled = max > 0 ? Math.round(value) : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Segment bar */}
      <div className="flex gap-px">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 transition-colors duration-300 ${
              i < filled ? "bg-hazard" : "bg-plate-alt border-b border-rule-faint"
            }`}
          />
        ))}
      </div>
      {/* Label */}
      <div className="flex justify-between mt-1">
        <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">
          QUESTION {filled} OF {max}
        </span>
        <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted tabular-nums">
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}
