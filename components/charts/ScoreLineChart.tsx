"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { date: string; score: number }[];
}

export default function ScoreLineChart({ data }: Props) {
  return (
    <div className="bg-plate border border-rule ind-surface">
      <div className="border-b border-rule px-4 py-2">
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          SCORE TELEMETRY / OVER TIME
        </span>
      </div>
      <div className="px-4 py-4">
        {data.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted">
              NO DATA RECORDED YET.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border-faint)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fontFamily: "var(--font-jetbrains)", textTransform: "uppercase", fill: "var(--fg-muted)" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 9, fontFamily: "var(--font-jetbrains)", fill: "var(--fg-muted)" }}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, "SCORE"]}
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 0,
                  fontSize: 10,
                  fontFamily: "var(--font-jetbrains)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              />
              <Line
                type="linear"
                dataKey="score"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--accent)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
