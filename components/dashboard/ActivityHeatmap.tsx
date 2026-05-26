"use client";

interface Props {
  data: { date: string; count: number }[];
}

function getOpacity(count: number): string {
  if (count === 0) return "bg-plate-alt border border-rule-faint";
  if (count === 1) return "bg-hazard opacity-20";
  if (count === 2) return "bg-hazard opacity-40";
  if (count === 3) return "bg-hazard opacity-70";
  return "bg-hazard";
}

export default function ActivityHeatmap({ data }: Props) {
  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];

  for (let i = 0; i < 52 * 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (52 * 7 - i - 1));
    const dateStr = d.toISOString().split("T")[0];
    const found = data.find((x) => x.date === dateStr);
    currentWeek.push({ date: dateStr, count: found?.count || 0 });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return (
    <div className="bg-plate border border-rule ind-surface">
      <div className="border-b border-rule px-4 py-2 flex items-center justify-between">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          ACTIVITY MATRIX / 52 WEEKS
        </span>
      </div>
      <div className="px-4 py-4">
        <div className="flex gap-px overflow-x-auto pb-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-px">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} quiz${day.count !== 1 ? "zes" : ""}`}
                  className={`w-2.5 h-2.5 ${getOpacity(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">LOW</span>
          {[0, 1, 2, 3, 4].map((v) => (
            <div key={v} className={`w-2.5 h-2.5 ${getOpacity(v)}`} />
          ))}
          <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-ink-muted">HIGH</span>
        </div>
      </div>
    </div>
  );
}
