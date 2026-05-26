interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
}

export default function StatsCard({ title, value, subtitle, icon, color = "" }: Props) {
  const isAlert = color.includes("red");
  const isWarn  = color.includes("amber") || color.includes("yellow");
  const isOk    = color.includes("green");

  const valueClass = isAlert
    ? "text-hazard"
    : isWarn
    ? "text-yellow-600 dark:text-yellow-400"
    : "text-ink";

  const statusChar = isAlert ? "▲" : isOk ? "●" : "○";
  const statusClass = isAlert ? "text-hazard" : isOk ? "status-ok" : "text-ink-muted";

  return (
    <div className="bg-plate border border-rule ind-surface p-0">
      {/* Top label bar */}
      <div className="border-b border-rule-faint px-4 py-2 flex items-center justify-between">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          {title}
        </span>
        <span className={`font-terminal text-[0.6rem] ${statusClass}`}>
          {statusChar}
        </span>
      </div>

      {/* Value */}
      <div className="px-4 pt-4 pb-3">
        <p
          className={`font-display uppercase leading-none ${valueClass}`}
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.02em" }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
